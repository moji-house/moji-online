import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { IComment } from "@/app/types/backend";
import { convertBigIntToString, serializeBigInt } from "@/app/util/serialize";
import { ISerializedComment } from "@/app/types/frontend";

// GET: ดึง comments ทั้งหมดของ property
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const propertyId = (await params).id;

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        propertyId: BigInt(propertyId),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        commentReplies: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
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
          orderBy: {
            createdAt: "desc",
          },
        },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // แปลง BigInt เป็น string และเพิ่ม likesCount
    const formattedComments: ISerializedComment = comments.map((comment: IComment) => {
      const formattedComment = {
        ...comment,
        likesCount: comment.likes?.length || 0,
        commentReplies: comment.commentReplies?.map(reply => ({
          ...reply,
          likesCount: reply.likes?.length || 0,
        })) || [],
      };

      // แปลง BigInt ที่เหลือทั้งหมดเป็น string
      return convertBigIntToString(formattedComment);
    });

    return NextResponse.json(formattedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST: สร้าง comment ใหม่
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const propertyId = (await params).id;
    const session = await getServerSession(authOptions);

    // Authentication check
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid request body format" },
        { status: 400 }
      );
    }

    const { content } = body;
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: "Content is required and cannot be empty" },
        { status: 400 }
      );
    }

    // หา user จาก email ใน session
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    // Verify property exists
    const propertyExists = await prisma.property.findUnique({
      where: {
        id: BigInt(propertyId),
      },
      select: {
        id: true,
      },
    });

    if (!propertyExists) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Create new comment with sanitized content
    const sanitizedContent = content.trim();
    const newComment = await prisma.comment.create({
      data: {
        content: sanitizedContent,
        propertyId: BigInt(propertyId),
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        commentReplies: {
          include: {
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
        likes: true,
      },
    });

    const enhancedComment = {
      ...newComment,
      likesCount: 0, // New comment has no likes
    };

    return NextResponse.json(serializeBigInt(enhancedComment));
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// PUT: อัปเดต comment
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid request body format" },
        { status: 400 }
      );
    }

    const { commentId, content } = body;

    if (!commentId || !content) {
      return NextResponse.json(
        { error: "Comment ID and content are required" },
        { status: 400 }
      );
    }

    // หา user จาก email ใน session
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    // ตรวจสอบว่า comment นี้เป็นของผู้ใช้หรือไม่
    const comment = await prisma.comment.findUnique({
      where: {
        id: BigInt(commentId),
      },
      select: {
        id: true,
        userId: true,
        propertyId: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    if (comment.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to edit this comment" },
        { status: 403 }
      );
    }

    // อัปเดต comment
    const updatedComment = await prisma.comment.update({
      where: {
        id: BigInt(commentId),
      },
      data: {
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        commentReplies: {
          include: {
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

    return NextResponse.json(serializeBigInt(updatedComment));
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

// DELETE: ลบ comment
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const propertyId = (await params).id;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { commentId } = body;

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    // หา user จาก email ใน session
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ตรวจสอบว่า comment นี้เป็นของผู้ใช้หรือไม่
    const comment = await prisma.comment.findUnique({
      where: {
        id: BigInt(commentId),
      },
      select: {
        userId: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    if (comment.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this comment" },
        { status: 403 }
      );
    }

    // ลบ comment และ commentReplies ทั้งหมด
    await prisma.comment.delete({
      where: {
        id: BigInt(commentId),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}