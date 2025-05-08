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
    const replyId = BigInt(id);

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

    // ตรวจสอบว่า reply มีอยู่จริง
    const reply = await prisma.commentReply.findUnique({
      where: { id: replyId },
      include: {
        comment: {
          include: {
            property: true
          }
        },
        likes: {
          where: {
            userId: user.id
          }
        }
      }
    });

    if (!reply) {
      return NextResponse.json(
        { error: 'ไม่พบความคิดเห็นที่ต้องการ' },
        { status: 404 }
      );
    }

    // ตรวจสอบว่าผู้ใช้เคยกดไลค์ reply นี้หรือไม่
    const existingLike = reply.likes[0];

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
      const newLike = await prisma.likeComment.create({
        data: {
          user: {
            connect: {
              id: user.id
            }
          },
          reply: {
            connect: {
              id: replyId
            }
          },
          property: {
            connect: {
              id: reply.comment.property.id
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          }
        }
      });

      return NextResponse.json({ 
        message: 'ไลค์เรียบร้อยแล้ว',
        isLiked: true,
        like: {
          id: newLike.id.toString(),
          userId: newLike.userId,
          user: newLike.user
        }
      });
    }
  } catch (error) {
    console.error('Error in like reply:', error);
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

    const reply = await prisma.commentReply.findUnique({
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

    if (!reply) {
      return NextResponse.json(
        { error: "Reply not found" },
        { status: 404 }
      );
    }

    // แปลง BigInt เป็น string
    const formattedReply = {
      id: reply.id.toString(),
      likes: reply.likes.map(like => ({
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
      reply: formattedReply,
      likesCount: reply.likes.length
    });
  } catch (error) {
    console.error("Error fetching reply likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch reply likes" },
      { status: 500 }
    );
  }
}