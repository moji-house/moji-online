import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { db } from '@/lib/db';  // ใช้ db instance ที่มีอยู่แล้ว แทนการสร้างใหม่

const prisma = new PrismaClient();

// Helper function to handle file uploads (in a real app, you'd upload to a service like S3)
async function saveDocuments(files) {
  // This is a placeholder. In a real app, you would:
  // 1. Upload the files to a storage service like AWS S3, Cloudinary, etc.
  // 2. Return the URLs or file information
  
  // For now, we'll just return dummy file info
  return files.map((file, index) => ({
    id: `doc-${Date.now()}-${index}`,
    filename: file.name,
    url: `/dummy-url/${file.name}`, // This would be the actual URL in production
    contentType: file.type,
    size: file.size
  }));
}

// ฟังก์ชันแปลงอาร์เรย์เป็นรูปแบบที่ PostgreSQL ต้องการ
function formatPgArray(arr) {
  if (!Array.isArray(arr)) {
    return '{}';
  }
  
  // แปลงอาร์เรย์เป็นรูปแบบ PostgreSQL: {value1,value2,value3}
  return '{' + arr.map(item => {
    if (typeof item === 'string') {
      // หากเป็นสตริง ต้องใส่เครื่องหมายคำพูด
      return `"${item.replace(/"/g, '\\"')}"`;
    }
    return item;
  }).join(',') + '}';
}

// ฟังก์ชันสำหรับอัปโหลดไฟล์ (ในตัวอย่างนี้เราจะเก็บเป็น Base64 string)
async function processImageFile(file) {
  if (!file || file.size === 0) return null;
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');
    const mimeType = file.type;
    
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error('Error processing image file:', error);
    return null;
  }
}

export async function POST(request) {
  try {
    // console.log('authOptions:', {
    //   adapter: authOptions.adapter,
    //   providers: authOptions.providers,
    //   callbacks: authOptions.callbacks,
    //   pages: authOptions.pages,
    //   secret: authOptions.secret ? 'มีค่า' : 'ไม่มีค่า',
    //   debug: authOptions.debug
    // });
    
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
    
    const avatar = await processImageFile(avatarFile);
    const backgroundImage = await processImageFile(backgroundFile);
    
    // Create user profile
    const user = await prisma.user.create({
      data: {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        googleId: formData.get('googleId'),
        phone: formData.get('phone'),
        birthDate: formData.get('birthDate') ? new Date(formData.get('birthDate')) : null,
        showBirthDate: formData.get('showBirthDate') === 'true',
        bio: formData.get('bio'),
        education: formData.get('education'),
        currentCompany: formData.get('currentCompany'),
        previousCompanies: formData.get('previousCompanies'),
        realEstateExperience: formData.get('realEstateExperience'),
        lineContact: formData.get('lineContact'),
        avatar: avatar,
        backgroundImage: backgroundImage,
        roles: {
          create: JSON.parse(formData.get('roles')).map(role => ({
            role: role
          }))
        }
      }
    });

    return NextResponse.json({ 
      message: 'Profile created successfully',
      user: user 
    });
  } catch (error) {
    console.error("Error in profile creation:", error);
    return NextResponse.json({
      error: "เกิดข้อผิดพลาดในการสร้างโปรไฟล์",
      details: error.message
    }, { status: 500 });
  }
}
