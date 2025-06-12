import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';
import { PrismaTransactionalClient } from '@/app/types/backend/IPrisma';
import ILike from '@/app/types/backend/ILike';
import { serializeBigInt } from '@/app/util/serialize';
import { IComment } from '@/app/types/backend';

// POST: Unlike/Like ของ POST
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Validate comment ID
    const id = (await params).id;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid comment ID" },
        { status: 400 }
      );
    }

    const commentId = BigInt(id);

    // Validate authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลผู้ใช้' },
        { status: 404 }
      );
    }

    // Check if comment exists and get property ID
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        propertyId: true
      }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'ไม่พบความคิดเห็นที่ต้องการ' },
        { status: 404 }
      );
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx: PrismaTransactionalClient) => {
      // Check if user already liked this comment
      const existingLike = await tx.likeComment.findFirst({
        where: {
          userId: user.id,
          commentId
        },
        select: {
          id: true
        }
      });

      let isLiked: boolean;
      let message: string;

      if (existingLike) {
        // Unlike: Remove existing like
        await tx.likeComment.delete({
          where: { id: existingLike.id }
        });

        // Remove the likesCount update since it doesn't exist in the schema
        isLiked = false;
        message = 'ยกเลิกการไลค์เรียบร้อยแล้ว';
      } else {
        // Like: Add new like
        await tx.likeComment.create({
          data: {
            userId: user.id,
            commentId,
            propertyId: comment.propertyId
          }
        });

        // Remove the likesCount update since it doesn't exist in the schema
        isLiked = true;
        message = 'ไลค์เรียบร้อยแล้ว';
      }

      // Get updated likes count by counting the relationship
      const likesCount = await tx.likeComment.count({
        where: { commentId }
      });

      return {
        isLiked,
        message,
        likesCount
      };
    });

    return NextResponse.json({
      message: result.message,
      isLiked: result.isLiked,
      likesCount: result.likesCount
    });
  } catch (error) {
    console.error('Error in like comment:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการทำรายการ' },
      { status: 500 }
    );
  }
}

// GET: ดึง Comment มากับไลค์ 
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Validate comment ID
    const id = (await params).id;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid comment ID" },
        { status: 400 }
      );
    }

    const commentId = BigInt(id);

    // Validate authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user for checking if user has liked the comment
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get comment with likes
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        likes: {
          select: {
            id: true,
            userId: true,
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

    // Check if current user has liked this comment
    const userLiked = comment.likes?.some((like: { userId: string }) => like.userId === user.id);

    // Set cache headers for better performance
    const headers = new Headers();
    headers.set('Cache-Control', 'private, max-age=30'); // Cache for 30 seconds

    return NextResponse.json({
      comment: serializeBigInt(comment),
      likesCount: comment.likes?.length,
      userLiked: userLiked
    }, { headers });
  } catch (error) {
    console.error("Error fetching comment likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch comment likes" },
      { status: 500 }
    );
  }
}