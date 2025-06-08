import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

// TODO: Check if this API should be exist or not
// Add coins to user balance
export async function POST(request: NextRequest) {
  try {
    const { userId, propertyPrice } = await request.json();
    
    if (!userId || !propertyPrice) {
      return NextResponse.json(
        { error: 'User ID and property price are required' },
        { status: 400 }
      );
    }
    
    // Calculate reward: 0.0001% of property price
    const coinReward = propertyPrice * 0.000001;
    
    // Update user's coin balance
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        coinBalance: {
          increment: coinReward
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        coinBalance: true
      }
    });
    
    return NextResponse.json({
      success: true,
      user: updatedUser,
      coinReward
    });
  } catch (error) {
    console.error('Error updating coin balance:', error);
    return NextResponse.json(
      { error: 'Failed to update coin balance' },
      { status: 500 }
    );
  }
}

// Get user's coin balance
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
    
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        coinBalance: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ coinBalance: user.coinBalance });
  } catch (error) {
    console.error('Error fetching coin balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coin balance' },
      { status: 500 }
    );
  }
}
