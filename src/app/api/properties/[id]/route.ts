import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { authOptions } from '../../auth/[...nextauth]/options';
import { IProperty, IPropertyImage, PrismaTransactionalClient } from '@/app/types/backend';
import { serializeBigInt } from '@/app/util/serialize';
import { UserSession } from '@/app/types/auth';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// GET: Get a single property by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

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
        votes: true
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeBigInt(property));
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// PUT: Update a property
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions) as UserSession | null;

    if (!session?.user?.id) {
      return NextResponse.json({
        error: "คุณต้องเข้าสู่ระบบก่อนทำรายการ"
      }, { status: 401 });
    }

    // Validate property ID
    const id = (await params).id;
    if (!id) {
      return NextResponse.json({
        error: "ไม่พบรหัสอสังหาริมทรัพย์"
      }, { status: 400 });
    }

    const propertyId = BigInt(id);

    // Fetch the property to check ownership
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        userId: true,
        images: {
          select: { id: true }
        }
      }
    });

    if (!property) {
      return NextResponse.json({
        error: "ไม่พบข้อมูลอสังหาริมทรัพย์"
      }, { status: 404 });
    }

    // Check if user is the owner
    if (property.userId.toString() !== session.user.id.toString()) {
      return NextResponse.json({
        error: "คุณไม่มีสิทธิ์แก้ไขข้อมูลนี้"
      }, { status: 403 });
    }

    // Parse form data
    const formData = await request.formData();

    // Extract and validate form fields
    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString();
    const priceStr = formData.get('price')?.toString();
    const address = formData.get('address')?.toString();
    const city = formData.get('city')?.toString();
    const bedroomsStr = formData.get('bedrooms')?.toString();
    const bathroomsStr = formData.get('bathrooms')?.toString();
    const areaStr = formData.get('area')?.toString();
    const status = formData.get('status')?.toString();
    const phone = formData.get('phone')?.toString();
    const lineId = formData.get('lineId')?.toString();
    const googleMapLink = formData.get('googleMapLink')?.toString();
    const coAgentCommissionStr = formData.get('coAgentCommission')?.toString();
    const coAgentIncentive = formData.get('coAgentIncentive')?.toString();
    const coAgentNotes = formData.get('coAgentNotes')?.toString();
    const deleteImagesStr = formData.get('deleteImages')?.toString();

    // Validate required fields
    if (!title || !description || !priceStr || !address || !city) {
      return NextResponse.json({
        error: "กรุณากรอกข้อมูลที่จำเป็น (หัวข้อ, รายละเอียด, ราคา, ที่อยู่, เมือง)"
      }, { status: 400 });
    }

    // Parse numeric values with validation
    let price: number, bedrooms: number, bathrooms: number, area: number, coAgentCommission: number | null = null;

    try {
      price = priceStr ? parseFloat(priceStr) : 0;
      if (isNaN(price) || price < 0) throw new Error("ราคาต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0");

      bedrooms = bedroomsStr ? parseInt(bedroomsStr) : 0;
      if (isNaN(bedrooms) || bedrooms < 0) throw new Error("จำนวนห้องนอนต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0");

      bathrooms = bathroomsStr ? parseInt(bathroomsStr) : 0;
      if (isNaN(bathrooms) || bathrooms < 0) throw new Error("จำนวนห้องน้ำต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0");

      area = areaStr ? parseFloat(areaStr) : 0;
      if (isNaN(area) || area < 0) throw new Error("พื้นที่ต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0");

      if (coAgentCommissionStr && coAgentCommissionStr.trim() !== '') {
        coAgentCommission = parseFloat(coAgentCommissionStr);
        if (isNaN(coAgentCommission) || coAgentCommission < 0) throw new Error("ค่าคอมมิชชั่นต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0");
      }
    } catch (error) {
      return NextResponse.json({
        error: error instanceof Error ? error.message : "ข้อมูลตัวเลขไม่ถูกต้อง"
      }, { status: 400 });
    }

    // Determine property status
    const propertyStatus = status === 'for sale' ? 'active' : (status === 'rent' ? 'rent' : 'active');

    // Handle image deletion if specified
    let imagesToDelete: string[] = [];
    if (deleteImagesStr) {
      try {
        imagesToDelete = JSON.parse(deleteImagesStr);

        // Validate format
        if (!Array.isArray(imagesToDelete)) {
          throw new Error("รูปแบบข้อมูลรูปภาพที่ต้องการลบไม่ถูกต้อง");
        }

        // Delete images from Cloudinary
        for (const imageId of imagesToDelete) {
          const imageToDelete = property.images?.find(img => img.id.toString() === imageId);
          // TODO: Improve delete image logic
          // if (imageToDelete?.publicId) {
          //   await cloudinary.uploader.destroy(imageToDelete.publicId);
          // }
        }

        // Delete images from database
        await prisma.propertyImage.deleteMany({
          where: {
            id: {
              in: imagesToDelete.map(id => BigInt(id))
            },
            propertyId
          }
        });
      } catch (error) {
        console.error('Error deleting images:', error);
        // Continue with update even if image deletion fails
      }
    }

    // Process new images
    const newImages: { imageUrl: string; publicId: string; isMain: boolean }[] = [];
    const imageFiles = formData.getAll('images');

    // Process images in parallel for better performance
    const imageUploadPromises = imageFiles.map(async (file) => {
      if (file instanceof File) {
        try {
          const buffer = await file.arrayBuffer();
          return new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: 'real-estate/properties',
                resource_type: 'auto',
                transformation: [
                  { width: 1200, height: 800, crop: 'limit' },
                  { quality: 'auto:good' }
                ]
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result as UploadApiResponse);
              }
            ).end(Buffer.from(buffer));
          });
        } catch (error) {
          console.error('Error uploading image:', error);
          return null;
        }
      }
      return null;
    });

    const uploadResults = (await Promise.all(imageUploadPromises)).filter((result): result is UploadApiResponse => result !== null);

    // Filter out failed uploads and prepare image data
    uploadResults.forEach((result, index) => {
      if (result) {
        newImages.push({
          imageUrl: result.secure_url,
          publicId: result.public_id,
          isMain: index === 0 && (property.images?.length === 0 || !property.images) // First image is main only if no existing images
        });
      }
    });

    // Update property in database using transaction
    const updatedProperty = await prisma.$transaction(async (tx: PrismaTransactionalClient) => {
      // Update the property
      const updated = await tx.property.update({
        where: { id: propertyId },
        data: {
          title,
          description,
          price,
          address,
          city,
          bedrooms,
          bathrooms,
          status: propertyStatus,
          phone: phone || null,
          line_id: lineId || null,
          google_map_link: googleMapLink || null,
          co_agent_commission: coAgentCommission,
          co_agent_incentive: coAgentIncentive || null,
          co_agent_notes: coAgentNotes || null,
          updatedAt: new Date(),
          images: {
            create: newImages
          }
        },
        include: {
          images: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          }
        }
      });

      return updated;
    });

    // Format response to handle BigInt
    const formattedProperty = {
      ...updatedProperty,
      id: updatedProperty.id.toString(),
      userId: updatedProperty.userId.toString(),
      user: updatedProperty.user ? {
        ...updatedProperty.user,
        id: updatedProperty.user.id.toString()
      } : null,
      images: updatedProperty.images.map((image: IPropertyImage) => ({
        ...image,
        id: image.id.toString(),
        propertyId: image.propertyId.toString()
      })),
      createdAt: updatedProperty.createdAt.toISOString(),
      updatedAt: updatedProperty.updatedAt.toISOString()
    };

    return NextResponse.json({
      message: "อัปเดตข้อมูลอสังหาริมทรัพย์เรียบร้อยแล้ว",
      property: formattedProperty
    });
  } catch (error) {
    console.error('Error updating property:', error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('BigInt')) {
        return NextResponse.json({
          error: "รูปแบบรหัสอสังหาริมทรัพย์ไม่ถูกต้อง"
        }, { status: 400 });
      }
    }

    return NextResponse.json({
      error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  } finally {
    // Ensure Prisma connection is properly closed
    await prisma.$disconnect();
  }
}
// DELETE: Delete a property by ID
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

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

    const session = await getServerSession(authOptions) as UserSession | null;
    if (!session || !session.user || session.user.id !== property.userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this property' },
        { status: 403 }
      );
    }

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
  } catch (error: any) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property', details: error.message },
      { status: 500 }
    );
  }
}