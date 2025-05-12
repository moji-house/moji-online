import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        coinBalance: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    // console.log('user', user)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // แปลง BigInt เป็น Number
    const balance = user.coinBalance?.balance ? Number(user.coinBalance.balance) : 0;

    // แปลง transactions ให้ถูกต้อง
    const transactions = user.coinBalance?.transactions?.map(transaction => ({
      ...transaction,
      amount: Number(transaction.amount),
      propertyId: transaction.propertyId ? Number(transaction.propertyId) : null,
      userId: Number(transaction.userId)
    })) || [];

    return NextResponse.json({
      balance,
      transactions
    });
  } catch (error) {
    console.error('Error fetching coin balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { amount, type, description, propertyId } = await request.json();
    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        coinBalance: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    const userId = user.id;

    // หา coin balance ของ user
    let coinBalance = await prisma.coinBalance.findUnique({
      where: { userId },
    });


    // ถ้าไม่มี coin balance ให้สร้างใหม่
    if (!coinBalance) {
      coinBalance = await prisma.coinBalance.create({
        data: {
          userId,
          balance: 0,
        },
      });
    }

    // ตรวจสอบยอดคงเหลือถ้าเป็นการหักเหรียญ
    if (amount < 0) {
      const newBalance = coinBalance.balance + amount;
      if (newBalance < 0) {
        return NextResponse.json(
          { error: "ยอดเหรียญไม่เพียงพอ" },
          { status: 400 }
        );
      }
    }

    // อัพเดท coin balance
    const updatedBalance = await prisma.coinBalance.update({
      where: { userId },
      data: {
        balance: coinBalance.balance + amount,
      },
    });

    // สร้าง transaction record
    const transaction = await prisma.coinTx.create({
      data: {
        type,
        amount,
        description,
        propertyId: propertyId ? BigInt(propertyId) : null,
        userId,
        coinBalanceId: coinBalance.id,
      },
    });

    // แปลง BigInt เป็น Number ก่อนส่ง response
    return NextResponse.json({
      success: true,
      balance: Number(updatedBalance.balance),
      transaction: {
        ...transaction,
        amount: Number(transaction.amount),
        propertyId: transaction.propertyId ? Number(transaction.propertyId) : null,
        userId: transaction.userId,
        coinBalanceId: transaction.coinBalanceId
      },
    });
  } catch (error) {
    console.error("Error updating coin balance:", error);
    return NextResponse.json(
      { error: "Failed to update coin balance" },
      { status: 500 }
    );
  }
} 