import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { convertBigIntToString } from '@/app/util/serialize';

const prisma = new PrismaClient();

// GET all profiles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const email = searchParams.get('email');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Build the where clause for the query
    const where: any = {};
    
    if (role) {
      where.roles = {
        some: {
          role: role
        }
      };
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (email) {
      where.email = email;
    }
    
    // Get total count for pagination
    const total = await prisma.user.count({ where });
    
    // Get profiles with pagination
    const profiles = await prisma.user.findMany({
      where,
      include: {
        roles: true
      },
      orderBy: {
        [sortBy]: order.toLowerCase()
      },
      skip: (page - 1) * limit,
      take: limit
    });
    
    const user = {
      profiles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };

    // Convert BigInt to string before returning
    const safeUser = convertBigIntToString(user);

    console.log('Fetched profiles:', safeUser.profiles[0]?.roles);
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}