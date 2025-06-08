import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's coin transactions
    const transactions = await db.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching coin transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coin transactions' },
      { status: 500 }
    );
  }
}

// TODO: Check if this API should be exist or not
export async function POST(request: NextRequest) {
  try {
    const { userId, amount, type, description, propertyId } = await request.json();

    if (!userId || !amount || !type) {
      return NextResponse.json(
        { error: 'User ID, amount, and type are required' },
        { status: 400 }
      );
    }

    // Create transaction record
    const transaction = await db.coinTransaction.create({
      data: {
        userId,
        amount,
        type,
        description,
        propertyId
      }
    });

    // Update user's coin balance
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        coinBalance: {
          increment: amount
        }
      },
      select: {
        id: true,
        coinBalance: true
      }
    });

    return NextResponse.json({
      success: true,
      transaction,
      newBalance: updatedUser.coinBalance
    });
  } catch (error) {
    console.error('Error creating coin transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create coin transaction' },
      { status: 500 }
    );
  }
}
