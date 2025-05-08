import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from 'cloudinary';
import { authOptions } from '../../auth/[...nextauth]/options';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = params.id;

    const property = await prisma.property.findUnique({
      where: {
        id: BigInt(id)
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true
          }
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
            isMain: true,
            propertyId: true,
            createdAt: true,
            updatedAt: true
          }
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        },
        videos: true,
        documents: true,
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // แปลงค่า BigInt เป็น String
    const serializedProperty = {
      ...property,
      id: String(property.id),
      userId: String(property.userId),
      user: property.user ? {
        ...property.user,
        id: String(property.user.id)
      } : null,
      images: property.images.map(image => ({
        ...image,
        id: String(image.id),
        propertyId: String(image.propertyId)
      })),
      likes: property.likes.map(like => ({
        ...like,
        id: String(like.id),
        propertyId: String(like.propertyId),
        userId: String(like.userId)
      })),
      comments: property.comments.map(comment => ({
        ...comment,
        id: String(comment.id),
        propertyId: String(comment.propertyId),
        userId: String(comment.userId),
        user: {
          ...comment.user,
          id: String(comment.user.id)
        }
      })),
      videos: property.videos.map(video => ({
        ...video,
        id: String(video.id),
        propertyId: String(video.propertyId)
      })),
      documents: property.documents.map(doc => ({
        ...doc,
        id: String(doc.id),
        propertyId: String(doc.propertyId)
      }))
    };

    return NextResponse.json(serializedProperty);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const propertyId = BigInt(params.id);
    
    // ตรวจสอบว่าผู้ใช้เป็นเจ้าของโพสต์หรือไม่
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { userId: true }
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (property.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // อัพโหลดรูปภาพใหม่
    const newImages = [];
    const imageFiles = formData.getAll('images');

    for (const file of imageFiles) {
      if (file instanceof File) {
        const buffer = await file.arrayBuffer();
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'real-estate/properties',
              resource_type: 'auto',
              transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(Buffer.from(buffer));
        });

        newImages.push({
          imageUrl: result.secure_url,
          publicId: result.public_id,
          isMain: newImages.length === 0 // รูปแรกจะเป็นรูปหลัก
        });
      }
    }

    // อัพเดทข้อมูลโพสต์
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: {
        title: formData.get('title'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        address: formData.get('address'),
        city: formData.get('city'),
        bedrooms: parseInt(formData.get('bedrooms')),
        bathrooms: parseInt(formData.get('bathrooms')),
        area: parseFloat(formData.get('area')),
        status: formData.get('status') === 'for sale' ? 'active' : 'rent',
        phone: formData.get('phone'),
        line_id: formData.get('lineId'),
        google_map_link: formData.get('googleMapLink'),
        co_agent_commission: formData.get('coAgentCommission') ? parseFloat(formData.get('coAgentCommission')) : null,
        co_agent_incentive: formData.get('coAgentIncentive'),
        co_agent_notes: formData.get('coAgentNotes'),
        images: {
          create: newImages
        }
      },
      include: {
        images: true
      }
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // ตรวจสอบว่ามี id ที่ถูกต้องหรือไม่
    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามี property นี้อยู่จริงหรือไม่
    const property = await prisma.property.findUnique({
      where: { id: BigInt(id) },
      include: {
        images: true,
        likes: true,
        comments: true
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // ตรวจสอบสิทธิ์การลบ (ในกรณีที่มีระบบ authentication)
    // ตัวอย่าง: ตรวจสอบว่าเป็นเจ้าของ property หรือเป็น admin
    // const session = await getServerSession(authOptions);
    // if (!session || (session.user.id !== property.userId && session.user.role !== 'admin')) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized to delete this property' },
    //     { status: 403 }
    //   );
    // }

    // ลบข้อมูลที่เกี่ยวข้องก่อน
    // ลบรูปภาพ
    if (property.images && property.images.length > 0) {
      await prisma.propertyImage.deleteMany({
        where: { propertyId: BigInt(id) }
      });
    }

    // ลบไลค์
    if (property.likes && property.likes.length > 0) {
      await prisma.like.deleteMany({
        where: { propertyId: BigInt(id) }
      });
    }

    // ลบคอมเมนต์
    if (property.comments && property.comments.length > 0) {
      await prisma.comment.deleteMany({
        where: { propertyId: BigInt(id) }
      });
    }

    // ลบข้อมูล property
    await prisma.property.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property', details: error.message },
      { status: 500 }
    );
  }
}
