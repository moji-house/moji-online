import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';
import ICoinTransaction from '@/app/types/backend/ICoinTransaction';

// GET: Get all transactions for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบก่อนดูประวัติการทำรายการ' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        coinTransactions: {
          orderBy: { createdAt: 'desc' },
          include: {
            property: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลผู้ใช้' },
        { status: 404 }
      );
    }

    const transactions = user.coinTransactions.map((tx: ICoinTransaction) => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      propertyId: tx.propertyId?.toString(),
      propertyTitle: tx.property?.title,
      date: tx.createdAt
    }));

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการทำรายการ' },
      { status: 500 }
    );
  }
} 