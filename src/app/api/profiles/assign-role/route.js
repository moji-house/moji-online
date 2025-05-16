import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
const allRoles = ['Owner', 'Agent', 'Customer'];

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({
        error: "You must be logged in",
      }, { status: 401 });
    }

    const { role } = await request.json();

    if (!role || !allRoles.includes(role)) {
      return NextResponse.json({
        error: "Invalid role selection",
      }, { status: 400 });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { roles: true }
    });
    
    if (!user) {
      // Create user if they don't exist yet
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          firstName: session.user.name?.split(' ')[0] || '',
          lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
          password: randomPassword, // Random secure password for OAuth users
          roles: {
            create: [{ role: role }]
          },
          avatar: session.user.image
        },
        include: { roles: true }
      });
    } else if (user.roles.length === 0) {
      // Add role to existing user
      await prisma.userRole.create({
        data: {
          userId: user.id,
          role: role
        }
      });
    }

    return NextResponse.json({
      message: 'Role assigned successfully',
      role: role
    });
  } catch (error) {
    console.error("Error in role assignment:", error);
    return NextResponse.json({
      error: "Failed to assign role",
      details: error.message
    }, { status: 500 });
  }
}
