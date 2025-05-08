import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// ฟังก์ชันสำหรับแปลงค่า BigInt เป็น string
function replacer(key, value) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions);
    const id = context.params.id;

    const user = await prisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        roles: true,
        properties: {
          include: {
            images: true,
            votes: true,
            propertyVotes: true,
            comments: {
              include: {
                user: true,
                likes: true,
                commentReplies: {
                  include: {
                    user: true
                  }
                }
              }
            },
            likes: true
          }
        },
        coinBalance: true,
        coinTransactions: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ใช้ replacer function ในการแปลงค่า BigInt
    const userJson = JSON.stringify(user, replacer);
    return new NextResponse(userJson, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 