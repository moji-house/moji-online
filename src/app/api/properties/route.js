import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import prisma from "@/lib/prisma";
import { uploadToCloudinary, uploadVideo, uploadPDF } from "@/lib/cloudinary";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters for filtering
    const query = Object.fromEntries(searchParams.entries());
    
    // Build filter conditions based on query parameters
    const whereClause = {};
    
    if (query.type) whereClause.type = query.type;
    if (query.minPrice) whereClause.price = { ...whereClause.price, gte: parseInt(query.minPrice) };
    if (query.maxPrice) whereClause.price = { ...whereClause.price, lte: parseInt(query.maxPrice) };
    if (query.bedrooms) whereClause.bedrooms = parseInt(query.bedrooms);
    if (query.bathrooms) whereClause.bathrooms = parseInt(query.bathrooms);
    
    // Fetch properties with filters
    const properties = await db.property.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          }
        },
        videos: true,
        documents: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // แปลงค่า BigInt เป็น String
    const serializedProperties = properties.map(property => ({
      ...property,
      id: String(property.id),
      userId: String(property.userId),
      user: property.user ? {
        ...property.user,
        id: String(property.user.id)
      } : null,
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
    }));

    return NextResponse.json(serializedProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

const awardCoinsToUser = async (userId, propertyPrice) => {
  try {
    const response = await fetch('/api/users/coins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, propertyPrice }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error awarding coins:', error);
  }
};

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ค้นหา user จาก email ใน session
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const imageFiles = formData.getAll('images');
    const videoFiles = formData.getAll('videos');
    const pdfFiles = formData.getAll('documents');
    
    const imageUrls = [];
    const videoUrls = [];
    const documentUrls = [];

    // อัพโหลดรูปภาพ
    for (const image of imageFiles) {
      try {
        const url = await uploadToCloudinary(image);
        imageUrls.push(url);
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
          { error: 'Error uploading image' },
          { status: 500 }
        );
      }
    }

    // อัพโหลดวิดีโอ
    for (const video of videoFiles) {
      try {
        const result = await uploadVideo(video);
        videoUrls.push({
          videoUrl: result.url,
          title: video.name
        });
      } catch (error) {
        console.error('Error uploading video:', error);
        return NextResponse.json(
          { error: 'Error uploading video' },
          { status: 500 }
        );
      }
    }

    // อัพโหลดเอกสาร PDF
    for (const pdf of pdfFiles) {
      try {
        const result = await uploadPDF(pdf);
        documentUrls.push({
          documentUrl: result.url,
          title: pdf.name
        });
      } catch (error) {
        console.error('Error uploading PDF:', error);
        return NextResponse.json(
          { error: 'Error uploading PDF' },
          { status: 500 }
        );
      }
    }

    // สร้าง property ในฐานข้อมูล
    const property = await prisma.property.create({
      data: {
        title: formData.get('title'),
        description: formData.get('description'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: null,
        zip_code: null,
        price: parseFloat(formData.get('price')),
        bedrooms: parseInt(formData.get('bedrooms')),
        bathrooms: parseInt(formData.get('bathrooms')),
        square_feet: parseFloat(formData.get('area')),
        status: formData.get('status'),
        phone: formData.get('phone'),
        line_id: formData.get('lineId'),
        google_map_link: formData.get('googleMapLink'),
        co_agent_commission: formData.get('coAgentCommission') ? parseFloat(formData.get('coAgentCommission')) : null,
        co_agent_incentive: formData.get('coAgentIncentive'),
        co_agent_notes: formData.get('coAgentNotes'),
        points: 0,
        userId: user.id,
        images: {
          create: imageUrls.map(url => ({
            imageUrl: url.url,
            isMain: false
          }))
        },
        videos: {
          create: videoUrls.map(video => ({
            videoUrl: video.videoUrl,
            title: video.title
          }))
        },
        documents: {
          create: documentUrls.map(doc => ({
            documentUrl: doc.documentUrl,
            title: doc.title
          }))
        }
      }
    });

    // แปลง BigInt เป็น String ก่อนส่งกลับ
    return NextResponse.json({ 
      message: "Property created successfully",
      propertyId: String(property.id)
    });

  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Error creating property' },
      { status: 500 }
    );
  }
}