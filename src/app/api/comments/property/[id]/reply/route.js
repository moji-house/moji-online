import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// ฟังก์ชันสำหรับแปลง BigInt เป็น string
const serializeBigInt = (data) => {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

// GET: ดึง replies ทั้งหมดของ comment
export async function GET(request, { params }) {
  try {
    const propertyId = params.id;

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    const replies = await prisma.commentReply.findMany({
      where: {
        propertyId: BigInt(propertyId),
        ...(commentId && { commentId: BigInt(commentId) }),
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
        comment: {
          select: {
            id: true,
            content: true,
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

    return NextResponse.json(serializeBigInt(replies));
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}

// POST: สร้าง reply ใหม่
export async function POST(request, { params }) {
  try {
    const propertyId = params.id;
    const session = await getServerSession(authOptions);

    if (!session) {
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

    const { content, commentId } = body;

    if (!content || !commentId) {
      return NextResponse.json(
        { error: "Content and comment ID are required" },
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

    // ตรวจสอบว่ามี comment หลักอยู่จริงหรือไม่
    const parentComment = await prisma.comment.findUnique({
      where: { id: BigInt(commentId) },
    });

    if (!parentComment) {
      return NextResponse.json(
        { error: "Parent comment not found" },
        { status: 404 }
      );
    }

    // สร้าง reply ใหม่
    const newReply = await prisma.commentReply.create({
      data: {
        content,
        commentId: BigInt(commentId),
        userId: user.id,
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
        comment: {
          select: {
            id: true,
            content: true,
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

    return NextResponse.json(serializeBigInt(newReply));
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}

// PUT: อัพเดท reply
export async function PUT(request, { params }) {
  try {
    const propertyId = params.id;
    const session = await getServerSession(authOptions);

    if (!session) {
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

    const { replyId, content } = body;

    if (!replyId || !content) {
      return NextResponse.json(
        { error: "Reply ID and content are required" },
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

    // ตรวจสอบว่าเป็นเจ้าของ reply หรือไม่
    const existingReply = await prisma.commentReply.findUnique({
      where: { id: BigInt(replyId) },
      include: {
        comment: true,
      },
    });

    if (!existingReply) {
      return NextResponse.json(
        { error: "Reply not found" },
        { status: 404 }
      );
    }

    if (existingReply.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to edit this reply" },
        { status: 403 }
      );
    }

    // อัพเดท reply
    const updatedReply = await prisma.commentReply.update({
      where: { id: BigInt(replyId) },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
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

    return NextResponse.json(serializeBigInt(updatedReply));
  } catch (error) {
    console.error("Error updating reply:", error);
    return NextResponse.json(
      { error: "Failed to update reply" },
      { status: 500 }
    );
  }
}

// DELETE: ลบ reply
export async function DELETE(request, { params }) {
  try {
    const propertyId = params.id;
    const session = await getServerSession(authOptions);

    if (!session) {
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

    const { replyId } = body;

    if (!replyId) {
      return NextResponse.json(
        { error: "Reply ID is required" },
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

    // ตรวจสอบว่าเป็นเจ้าของ reply หรือไม่
    const existingReply = await prisma.commentReply.findUnique({
      where: { id: BigInt(replyId) },
      include: {
        comment: true,
      },
    });

    if (!existingReply) {
      return NextResponse.json(
        { error: "Reply not found" },
        { status: 404 }
      );
    }

    if (existingReply.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this reply" },
        { status: 403 }
      );
    }

    // ลบ reply
    await prisma.commentReply.delete({
      where: { id: BigInt(replyId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reply:", error);
    return NextResponse.json(
      { error: "Failed to delete reply" },
      { status: 500 }
    );
  }
} 