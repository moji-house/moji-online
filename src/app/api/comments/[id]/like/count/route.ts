import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import ILike from "@/app/types/backend/ILike";

interface Params {
  params: {
    id: string;
  }
}

// PUT: อัพเดทจำนวนไลค์ของ Comment
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = (await params).id;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid comment ID" },
        { status: 400 }
      );
    }

    const { likes } = await request.json();
    const commentId = BigInt(id);

    // Use a transaction to ensure data consistency
    const updatedComment = await prisma.$transaction(async (tx) => {
      // Get the comment to verify it exists and get propertyId
      const comment = await tx.comment.findUnique({
        where: { id: commentId },
        select: { id: true, propertyId: true }
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      // Get existing likes
      const existingLikes = await tx.likeComment.findMany({
        where: { commentId },
        select: { userId: true }
      });

      const existingLikeUserIds = existingLikes.map(like => like.userId);
      const newLikeUserIds = likes.map(like => like.userId);

      // Find likes to add and remove
      const likesToAdd = newLikeUserIds.filter(id => !existingLikeUserIds.includes(id));
      const likesToRemove = existingLikeUserIds.filter(id => !newLikeUserIds.includes(id));

      // Remove likes that are no longer in the list
      if (likesToRemove.length > 0) {
        await tx.likeComment.deleteMany({
          where: {
            commentId,
            userId: { in: likesToRemove }
          }
        });
      }

      // Add new likes
      for (const userId of likesToAdd) {
        await tx.likeComment.create({
          data: {
            userId,
            commentId,
            propertyId: comment.propertyId
          }
        });
      }

      // Return the updated comment with likes
      return tx.comment.findUnique({
        where: { id: commentId },
        include: {
          likes: {
            select: {
              id: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                }
              }
            }
          }
        }
      });
    });

    if (!updatedComment) {
      return NextResponse.json(
        { error: "Failed to update comment likes" },
        { status: 500 }
      );
    }

    // Format the response
    const formattedComment = {
      ...updatedComment,
      id: updatedComment.id.toString(),
      propertyId: updatedComment.propertyId.toString(),
      userId: updatedComment.userId.toString(),
      likesCount: updatedComment.likes.length,
      likes: updatedComment.likes.map((like: ILike) => ({
        ...like,
        id: like.id.toString(),
        userId: like.userId.toString(),
        user: like.user ? {
          ...like.user,
          id: like.user.id,
        } : undefined,
      })),
    };

    return NextResponse.json(formattedComment);
  } catch (error) {
    console.error("Error updating likes count:", error);
    return NextResponse.json(
      { error: "Failed to update likes count" },
      { status: 500 }
    );
  }
}
