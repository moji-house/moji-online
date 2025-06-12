import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { convertBigIntToString } from '@/app/util/serialize';
import { IUserRole } from '@/app/types/backend';

// PUT: เพื่อแก้ไขข้อมูลของผู้ใช้
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // รอให้ params พร้อมใช้งาน
    const id = (await params).id;
    const formData = await request.formData();

    // ดึงข้อมูลจาก formData
    const firstName = formData.get('firstName')?.toString() || null;
    const lastName = formData.get('lastName')?.toString() || null;
    const birthDateStr = formData.get('birthDate')?.toString() || null;
    const showBirthDate = formData.get('showBirthDate') === 'true';
    const education = formData.get('education')?.toString() || null;
    const currentCompany = formData.get('currentCompany')?.toString() || null;
    const previousCompanies = formData.get('previousCompanies')?.toString() || null;
    const email = formData.get('email')?.toString() || null;
    const phone = formData.get('phone')?.toString() || null;
    const lineContact = formData.get('lineContact')?.toString() || null;
    const realEstateExperience = formData.get('realEstateExperience')?.toString() || null;
    const bio = formData.get('bio')?.toString() || null;

    // แปลงค่า birthDate ให้เป็น DateTime หรือ null
    const birthDate = birthDateStr ? new Date(birthDateStr) : null;

    // อัพโหลดรูปภาพ avatar
    let avatarUrl = null;
    const avatarFile = formData.get('avatar');
    if (avatarFile && avatarFile instanceof File) {
      try {
        const uploadResult = await uploadToCloudinary(avatarFile, 'real-estate/profiles/avatars');
        avatarUrl = uploadResult.url;
      } catch (error) {
        console.error('Error uploading avatar:', error);
        return NextResponse.json(
          { error: 'ไม่สามารถอัพโหลดรูปโปรไฟล์ได้' },
          { status: 500 }
        );
      }
    }

    // อัพโหลดรูปภาพ background
    let backgroundImageUrl = null;
    const backgroundFile = formData.get('backgroundImage');
    if (backgroundFile && backgroundFile instanceof File) {
      try {
        const uploadResult = await uploadToCloudinary(backgroundFile, 'real-estate/profiles/backgrounds');
        backgroundImageUrl = uploadResult.url;
      } catch (error) {
        console.error('Error uploading background image:', error);
        return NextResponse.json(
          { error: 'ไม่สามารถอัพโหลดรูปพื้นหลังได้' },
          { status: 500 }
        );
      }
    }

    // อัพเดทข้อมูลในฐานข้อมูล
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        firstName: { set: firstName },
        lastName: { set: lastName },
        birthDate: { set: birthDate },
        showBirthDate: { set: showBirthDate },
        education: { set: education },
        currentCompany: { set: currentCompany },
        previousCompanies: { set: previousCompanies },
        email: { set: email },
        phone: { set: phone },
        lineContact: { set: lineContact },
        realEstateExperience: { set: realEstateExperience },
        bio: { set: bio },
        ...(avatarUrl && { avatar: { set: avatarUrl } }),
        ...(backgroundImageUrl && { backgroundImage: { set: backgroundImageUrl } })
      },
      include: {
        roles: true
      }
    });

    // แปลงข้อมูลก่อนส่งกลับ
    const safeProfile = {
      ...updatedUser,
      id: updatedUser.id.toString(),
      birthDate: updatedUser.birthDate?.toISOString() || null,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
      roles: updatedUser.roles.map((role: IUserRole) => ({
        ...role,
        id: role.id.toString()
      }))
    };

    // แปลง BigInt ทั้งหมดเป็น string
    const finalProfile = convertBigIntToString(safeProfile);

    return NextResponse.json(finalProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถอัปเดตโปรไฟล์ได้' },
      { status: 500 }
    );
  }
}