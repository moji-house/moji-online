import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import prisma from "@/lib/prisma";
import { uploadToCloudinary, uploadVideo, uploadPDF } from "@/lib/cloudinary";
import { IProperty, PrismaTransactionalClient } from '@/app/types/backend';
import { parseNumericField, serializeBigInt } from '@/app/util/serialize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters for filtering
    const query = Object.fromEntries(searchParams.entries());

    // Build filter conditions based on query parameters
    const whereClause: any = {};

    if (query.type) whereClause.type = query.type;
    if (query.minPrice) whereClause.price = { ...whereClause.price, gte: parseInt(query.minPrice) };
    if (query.maxPrice) whereClause.price = { ...whereClause.price, lte: parseInt(query.maxPrice) };
    if (query.bedrooms) whereClause.bedrooms = parseInt(query.bedrooms);
    if (query.bathrooms) whereClause.bathrooms = parseInt(query.bathrooms);

    // Fetch properties with filters
    const properties: IProperty[] = await db.property.findMany({
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

    return NextResponse.json(serializeBigInt(properties));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const requiredFields = ['title', 'description', 'price', 'address', 'city', 'bedrooms', 'bathrooms', 'area', 'status'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}`, code: "MISSING_FIELD" },
          { status: 400 }
        );
      }
    }

    const imageFiles = formData.getAll('images');
    const videoFiles = formData.getAll('videos');
    const pdfFiles = formData.getAll('documents');

    if (!imageFiles.length) {
      return NextResponse.json(
        { error: "At least one image is required", code: "NO_IMAGES" },
        { status: 400 }
      );
    }

    const uploadPromises = {
      images: imageFiles.map(async (image) => {
        try {
          if (image instanceof File) {
            return await uploadToCloudinary(image);
          } else {
            throw new Error('Invalid image format');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          throw new Error(`Failed to upload image: ${image instanceof File ? image.name : 'unknown'}`);
        }
      }),
      videos: videoFiles.map(async (video) => {
        try {
          if (video instanceof File) {
            const result = await uploadVideo(video);
            return {
              videoUrl: result.url,
              title: video.name
            };
          } else {
            throw new Error('Invalid video format');
          }
        } catch (error) {
          console.error('Error uploading video:', error);
          throw new Error(`Failed to upload video: ${video instanceof File ? video.name : 'unknown'}`);
        }
      }),
      documents: pdfFiles.map(async (pdf) => {
        try {
          if (pdf instanceof File) {
            const result = await uploadPDF(pdf);
            return {
              documentUrl: result.url,
              title: pdf.name
            };
          } else {
            throw new Error('Invalid document format');
          }
        } catch (error) {
          console.error('Error uploading PDF:', error);
          throw new Error(`Failed to upload PDF: ${pdf instanceof File ? pdf.name : 'unknown'}`);
        }
      })
    };

    const [imageUrls, videoUrls, documentUrls] = await Promise.all([
      Promise.all(uploadPromises.images),
      Promise.all(uploadPromises.videos),
      Promise.all(uploadPromises.documents)
    ]);

    // สร้าง property ในฐานข้อมูล
    const property = await prisma.$transaction(async (tx: PrismaTransactionalClient) => {
      // Create the property
      const newProperty = await tx.property.create({
        data: {
          title: formData.get('title')?.toString() || '',
          description: formData.get('description')?.toString() || '',
          address: formData.get('address')?.toString() || '',
          city: formData.get('city')?.toString() || '',
          state: formData.get('state')?.toString() || null,
          zip_code: formData.get('zip_code')?.toString() || null,
          price: parseNumericField(formData, 'price'),
          bedrooms: parseInt(formData.get('bedrooms')?.toString() || '0'),
          bathrooms: parseInt(formData.get('bathrooms')?.toString() || '0'),
          square_feet: parseNumericField(formData, 'area'),
          status: formData.get('status')?.toString() || 'active',
          phone: formData.get('phone')?.toString() || null,
          line_id: formData.get('lineId')?.toString() || null,
          google_map_link: formData.get('googleMapLink')?.toString() || null,
          co_agent_commission: formData.get('coAgentCommission')
            ? parseNumericField(formData, 'coAgentCommission')
            : null,
          co_agent_incentive: formData.get('coAgentIncentive')?.toString() || null,
          co_agent_notes: formData.get('coAgentNotes')?.toString() || null,
          points: 0,
          userId: user.id,
          images: {
            create: imageUrls.map((url, index) => ({
              imageUrl: url.url,
              isMain: index === 0 // Set first image as main image
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

      // Update the user's propertiesCount
      await tx.user.update({
        where: { id: user.id },
        data: {
          propertiesCount: {
            increment: 1
          }
        }
      });

      return newProperty;
    });

    // แปลง BigInt เป็น String ก่อนส่งกลับ
    return NextResponse.json({
      message: "Property created successfully",
      propertyId: String(property.id),
      property: {
        id: String(property.id),
        title: property.title,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        city: property.city,
        status: property.status,
        createdAt: property.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Error creating property' },
      { status: 500 }
    );
  }
}