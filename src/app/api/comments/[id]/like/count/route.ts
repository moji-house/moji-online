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
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid comment ID" },
        { status: 400 }
      );
    }

    const { likes } = await request.json();

    // อัพเดทจำนวนไลค์ในฐานข้อมูล
    const updatedComment = await prisma.comment.update({
      where: {
        id: BigInt(id),
      },
      data: {
        likesCount: likes.length,
      },
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
              },
            },
          },
        },
      },
    });

    // แปลง BigInt เป็น string
    const formattedComment = {
      ...updatedComment,
      id: updatedComment.id.toString(),
      propertyId: updatedComment.propertyId.toString(),
      userId: updatedComment.userId.toString(),
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