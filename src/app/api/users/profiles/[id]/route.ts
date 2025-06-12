import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { replacer } from '@/app/util/serialize';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const id = (await params).id;

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