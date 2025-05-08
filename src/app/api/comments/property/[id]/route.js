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

// GET: ดึง comments ทั้งหมดของ property
export async function GET(request, { params }) {
  try {
    const param = await params;
    const propertyId = param.id; // ใช้ params.id โดยตรง ไม่ต้อง await

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

    // ฟังก์ชันสำหรับแปลง BigInt เป็น string
    const convertBigIntToString = (obj) => {
      if (obj === null || obj === undefined) return obj;
      if (typeof obj === 'bigint') return obj.toString();
      if (Array.isArray(obj)) return obj.map(convertBigIntToString);
      if (typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
          newObj[key] = convertBigIntToString(obj[key]);
        }
        return newObj;
      }
      return obj;
    };

    // แปลง BigInt เป็น string และเพิ่ม likesCount
    const formattedComments = comments.map(comment => {
      const formattedComment = {
        ...comment,
        id: comment.id.toString(),
        propertyId: comment.propertyId.toString(),
        userId: comment.userId.toString(),
        likesCount: comment.likes.length,
        likes: comment.likes.map(like => ({
          ...like,
          id: like.id.toString(),
          userId: like.userId.toString(),
          user: {
            ...like.user,
            id: like.user.id.toString(),
          },
        })),
        commentReplies: comment.commentReplies.map(reply => ({
          ...reply,
          id: reply.id.toString(),
          propertyId: reply.propertyId.toString(),
          userId: reply.userId.toString(),
          likesCount: reply.likes.length,
          likes: reply.likes.map(like => ({
            ...like,
            id: like.id.toString(),
            userId: like.userId.toString(),
            user: {
              ...like.user,
              id: like.user.id.toString(),
            },
          })),
        })),
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

// GET: ดึงข้อมูลผู้โพสต์คอมเม้นต์
// export async function GETuserComment(request, { params }) {
//   try {
//     // ใช้ params.id โดยตรง ไม่ต้อง await
//     const propertyId = params.id;
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // หา user จาก email ใน session
//     const user = await prisma.user.findUnique({
//       where: {
//         email: session.user.email,
//       },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         avatar: true,
//         email: true,
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     // ดึงคอมเม้นต์ของผู้ใช้
//     const userComments = await prisma.comment.findMany({
//       where: {
//         propertyId: BigInt(propertyId),
//         userId: user.id,
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             avatar: true,
//           },
//         },
//         commentReplies: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 firstName: true,
//                 lastName: true,
//                 avatar: true,
//               },
//             },
//           },
//           orderBy: {
//             createdAt: "desc",
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json(serializeBigInt(userComments));
//   } catch (error) {
//     console.error("Error fetching user comments:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch user comments" },
//       { status: 500 }
//     );
//   }
// }

// POST: สร้าง comment ใหม่
export async function POST(request, { params }) {
  try {
    const propertyId = await params.id;
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

    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
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

    // สร้าง comment ใหม่
    const newComment = await prisma.comment.create({
      data: {
        content,
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
      },
    });

    return NextResponse.json(serializeBigInt(newComment));
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// PUT: อัปเดต comment
export async function PUT(request, { params }) {
  try {
    const propertyId = await params.id;
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
export async function DELETE(request, { params }) {
  try {
    const propertyId = await params.id;
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