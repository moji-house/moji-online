import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { processImageFile } from '@/app/util/helper';
import { IUserRole } from '@/app/types/backend';

const prisma = new PrismaClient();

// POST: Create a new user profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({
        error: "คุณต้องเข้าสู่ระบบก่อน",
      }, { status: 401 });
    }

    const formData = await request.formData();

    // Process image files
    const avatarFile = formData.get('avatar');
    const backgroundFile = formData.get('backgroundImage');

    const avatar = await processImageFile(avatarFile instanceof File ? avatarFile : null);
    const backgroundImage = await processImageFile(backgroundFile instanceof File ? backgroundFile : null);

    // Create user profile
    const user = await prisma.user.create({
      data: {
        firstName: formData.get('firstName')?.toString() || '',
        lastName: formData.get('lastName')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        googleId: formData.get('googleId')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        birthDate: formData.get('birthDate') ? new Date(formData.get('birthDate')!.toString()) : null,
        showBirthDate: formData.get('showBirthDate') === 'true',
        bio: formData.get('bio')?.toString() || '',
        education: formData.get('education')?.toString() || '',
        currentCompany: formData.get('currentCompany')?.toString() || '',
        previousCompanies: formData.get('previousCompanies')?.toString() || '',
        realEstateExperience: formData.get('realEstateExperience')?.toString() || '',
        lineContact: formData.get('lineContact')?.toString() || '',
        avatar: avatar,
        backgroundImage: backgroundImage,
        password: formData.get('password')?.toString() || '',
        roles: {
          create: JSON.parse(formData.get('roles')?.toString() || '[]').map((role: IUserRole) => ({
            role: role
          }))
        }
      }
    });

    return NextResponse.json({
      message: 'Profile created successfully',
      user: user
    });
  } catch (error: any) {
    console.error("Error in profile creation:", error);
    return NextResponse.json({
      error: "เกิดข้อผิดพลาดในการสร้างโปรไฟล์",
      details: error.message
    }, { status: 500 });
  }
}