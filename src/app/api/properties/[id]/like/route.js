import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../auth/[...nextauth]/options';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ค้นหา user จาก email ใน session
    const user = await db.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = user.id;

    console.log("userId", userId);

    // ตรวจสอบว่ามี like อยู่แล้วหรือไม่
    const existingLike = await db.like.findFirst({
      where: {
        propertyId: id,
        userId: userId,
      },
    });

    if (existingLike) {
      // ถ้ามี like อยู่แล้ว ให้ลบออก
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ liked: false });
    } else {
      // ถ้ายังไม่มี like ให้สร้างใหม่
      await db.like.create({
        data: {
          propertyId: id,
          userId: userId,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error handling like:', error);
    return NextResponse.json(
      { error: 'Failed to handle like' },
      { status: 500 }
    );
  }
} 