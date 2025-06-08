import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/app/util/serialize";

// GET: ดึงข้อมูลอสังหาริมทรัพย์ของผู้ใช้
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const { id: userId } = params;

    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "ไม่พบรหัสผู้ใช้" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่จริงหรือไม่
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    // ดึงข้อมูลอสังหาริมทรัพย์ของผู้ใช้
    const properties = await prisma.property.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            roles: {
              select: {
                role: true
              }
            }
          }
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
            isMain: true
          }
        },
        votes: {
          select: {
            id: true,
            voteType: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: [
        { points: "desc" },
        { createdAt: "desc" }
      ]
    });

    return NextResponse.json(serializeBigInt(properties));
  } catch (error) {
    console.error("Error fetching user properties:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลอสังหาริมทรัพย์ของผู้ใช้ได้" },
      { status: 500 }
    );
  }
} 