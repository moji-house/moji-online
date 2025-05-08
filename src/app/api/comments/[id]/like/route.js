import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' },
        { status: 401 }
      );
    }

    const { id } = params;
    const commentId = BigInt(id);

    // ค้นหาผู้ใช้จากอีเมล
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลผู้ใช้' },
        { status: 404 }
      );
    }

    // ตรวจสอบว่าความคิดเห็นมีอยู่จริง
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        property: true
      }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'ไม่พบความคิดเห็นที่ต้องการ' },
        { status: 404 }
      );
    }

    // ตรวจสอบว่าผู้ใช้เคยกดไลค์ความคิดเห็นนี้หรือไม่
    const existingLike = await prisma.likeComment.findFirst({
      where: {
        userId: user.id,
        commentId: commentId
      }
    });

    if (existingLike) {
      // ถ้าเคยกดไลค์แล้ว ให้ยกเลิกการไลค์
      await prisma.likeComment.delete({
        where: { id: existingLike.id }
      });

      return NextResponse.json({ 
        message: 'ยกเลิกการไลค์เรียบร้อยแล้ว',
        isLiked: false
      });
    } else {
      // ถ้ายังไม่เคยกดไลค์ ให้เพิ่มการไลค์
      await prisma.likeComment.create({
        data: {
          userId: user.id,
          commentId: commentId,
          propertyId: comment.property.id
        }
      });

      return NextResponse.json({ 
        message: 'ไลค์เรียบร้อยแล้ว',
        isLiked: true
      });
    }
  } catch (error) {
    console.error('Error in like comment:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการทำรายการ' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: BigInt(id) },
      include: {
        likes: {
          include: {
            user: {
              select: {
                id: true,
                avatar: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // แปลง BigInt เป็น string
    const formattedComment = {
      id: comment.id.toString(),
      likes: comment.likes.map(like => ({
        id: like.id.toString(),
        userId: like.userId,
        user: {
          id: like.user.id,
          avatar: like.user.avatar,
          firstName: like.user.firstName,
          lastName: like.user.lastName
        }
      }))
    };

    return NextResponse.json({
      comment: formattedComment,
      likesCount: comment.likes.length
    });
  } catch (error) {
    console.error("Error fetching comment likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch comment likes" },
      { status: 500 }
    );
  }
} 