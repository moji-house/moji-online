import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';
import ITransaction from '@/app/types/backend/ITransaction';
import { PrismaTransactionalClient } from '@/app/types/backend/IPrisma';

// GET: Get coin balance and transactions
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const balance = user.coinBalance?.balance ? Number(user.coinBalance.balance) : 0;

    const transactions = user.coinBalance?.transactions?.map((transaction: ITransaction) => ({
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

// POST: Create a new transaction
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { amount, type, description, propertyId } = body;

    // Validate required fields
    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    if (!type || typeof type !== 'string') {
      return NextResponse.json(
        { error: "Valid transaction type is required" },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Validate amount is a number
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return NextResponse.json(
        { error: "Amount must be a valid number" },
        { status: 400 }
      );
    }

    // Validate authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
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
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = user.id;

    // Transaction handling with Prisma transaction for data integrity
    const result = await prisma.$transaction(async (tx: PrismaTransactionalClient) => {
      // Get or create coin balance
      let coinBalance = await tx.coinBalance.findUnique({
        where: { userId },
        select: { id: true, balance: true }
      });

      if (!coinBalance) {
        coinBalance = await tx.coinBalance.create({
          data: {
            userId,
            balance: 0,
          },
          select: { id: true, balance: true }
        });
      }

      // Check if balance will be negative after transaction
      if (numericAmount < 0) {
        const newBalance = Number(coinBalance.balance) + numericAmount;
        if (newBalance < 0) {
          throw new Error("ยอดเหรียญไม่เพียงพอ");
        }
      }

      // Update balance
      const updatedBalance = await tx.coinBalance.update({
        where: { userId },
        data: {
          balance: {
            increment: numericAmount
          }
        },
        select: { balance: true }
      });

      // Create transaction record
      const transaction = await tx.coinTx.create({
        data: {
          type,
          amount: numericAmount,
          description,
          propertyId: propertyId ? BigInt(propertyId) : null,
          userId,
          coinBalanceId: coinBalance.id,
        },
        select: {
          id: true,
          type: true,
          amount: true,
          description: true,
          propertyId: true,
          userId: true,
          coinBalanceId: true,
          createdAt: true,
          property: propertyId ? {
            select: {
              id: true,
              title: true
            }
          } : undefined
        }
      });

      return { updatedBalance, transaction };
    });

    // Format response
    return NextResponse.json({
      success: true,
      balance: Number(result.updatedBalance.balance),
      transaction: {
        id: result.transaction.id,
        type: result.transaction.type,
        amount: Number(result.transaction.amount),
        description: result.transaction.description,
        propertyId: result.transaction.propertyId ? Number(result.transaction.propertyId) : null,
        propertyTitle: result.transaction.property?.title || null,
        userId: result.transaction.userId,
        coinBalanceId: result.transaction.coinBalanceId,
        date: result.transaction.createdAt
      },
    });
  } catch (error) {
    console.error("Error updating coin balance:", error);

    // Handle specific errors
    if (error instanceof Error && error.message === "ยอดเหรียญไม่เพียงพอ") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update coin balance" },
      { status: 500 }
    );
  }
}
