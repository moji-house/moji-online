import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { PrismaTransactionalClient } from '@/app/types/backend';

// POST: Create a new vote for a property
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    // ดึง session
    const session = await getServerSession(authOptions);

    const { voteType, points } = await request.json();

    // ตรวจสอบว่ามี session และ email หรือไม่
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบก่อนลงคะแนน' },
        { status: 401 }
      );
    }

    // console.log('Received data:', { id, email: session.user.email, voteType, points });

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!voteType || !points) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบ voteType และ points' },
        { status: 400 }
      );
    }

    // ค้นหาผู้ใช้จากอีเมล
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบผู้ใช้ที่ระบุ' },
        { status: 404 }
      );
    }

    // ตรวจสอบว่าอสังหาริมทรัพย์มีอยู่จริง
    const property = await prisma.property.findUnique({
      where: { id: BigInt(id) }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'ไม่พบอสังหาริมทรัพย์ที่ระบุ' },
        { status: 404 }
      );
    }

    // แปลงค่า points เป็นตัวเลข
    const pointsValue = parseInt(points, 10);
    if (isNaN(pointsValue)) {
      return NextResponse.json(
        { error: 'ค่า points ไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // ใช้ Prisma transaction แทน raw SQL
    const result = await prisma.$transaction(async (tx: PrismaTransactionalClient) => {
      // ตรวจสอบว่ามีการโหวตอยู่แล้วหรือไม่
      const existingVote = await tx.propertyVote.findFirst({
        where: {
          propertyId: BigInt(id),
          userId: user.id
        }
      });

      if (existingVote) {
        await tx.propertyVote.update({
          where: {
            id: existingVote.id
          },
          data: {
            voteType: 'vote',
            createdAt: new Date()
          }
        });
      } else {
        await tx.propertyVote.create({
          data: {
            propertyId: BigInt(id),
            userId: user.id,
            voteType: 'vote'
          }
        });
      }

      // อัพเดทคะแนนของประกาศ
      const updatedProperty = await tx.property.update({
        where: {
          id: BigInt(id)
        },
        data: {
          points: {
            increment: pointsValue
          }
        }
      });

      return updatedProperty;
    });

    // แปลงค่า BigInt เป็น String ก่อนส่งกลับ
    const serializedResult = {
      ...result,
      id: result.id.toString(),
      userId: result.userId.toString()
    };

    return NextResponse.json(serializedResult, { status: 200 });
  } catch (error: any) {
    console.error('Error processing vote:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการประมวลผลการลงคะแนน: ' + error.message },
      { status: 500 }
    );
  }
}
