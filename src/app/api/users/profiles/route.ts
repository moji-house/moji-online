import { IUser } from '@/app/types/backend';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// TODO: Check if this API should be exist or not
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        roles: true,
      },
    });

    // Transform the data to match the frontend requirements
    const transformedUsers = users.map((user: IUser) => ({
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      currentCompany: user.currentCompany || 'N/A',
      education: user.education || '',
      previousCompanies: user.previousCompanies || '',
      realEstateExperience: user.realEstateExperience || '',
      lineContact: user.lineContact || '',
      role: user.roles?.[0]?.role || 'Customer',
      votes: user.votes,
      followers: user.followers,
      properties: user.properties,
      bio: user.bio || '',
      avatar: user.avatar || '/default-avatar.png',
      backgroundImage: user.backgroundImage || '/default-background.jpg',
      isFollowing: false, // This will be handled by the frontend
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
