import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// Function to handle BigInt serialization
const serializeBigInt = (data) => {
  if (data === null || data === undefined) return data;
  
  if (typeof data === 'bigint') {
    return data.toString();
  }
  
  if (Array.isArray(data)) {
    return data.map(item => serializeBigInt(item));
  }
  
  if (typeof data === 'object') {
    const result = {};
    for (const key in data) {
      result[key] = serializeBigInt(data[key]);
    }
    return result;
  }
  
  return data;
};

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const { id: propertyId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      );
    }

    if (!propertyId) {
      return NextResponse.json(
        { error: "ไม่พบรหัสอสังหาริมทรัพย์" },
        { status: 400 }
      );
    }

    // Get property data
    const property = await prisma.property.findUnique({
      where: { id: BigInt(propertyId) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            lineContact: true,
            currentCompany: true,
            realEstateExperience: true
          }
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
            isMain: true
          }
        },
        documents: {
          select: {
            id: true,
            documentUrl: true
          }
        }
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลอสังหาริมทรัพย์" },
        { status: 404 }
      );
    }

    // Get buyer data (current user)
    const buyer = userId ? await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        lineContact: true,
        currentCompany: true,
        realEstateExperience: true
      }
    }) : null;

    if (userId && !buyer) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ซื้อ" },
        { status: 404 }
      );
    }

    const response = {
      property: serializeBigInt(property),
      buyer: buyer ? serializeBigInt(buyer) : null,
      seller: serializeBigInt(property.user)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching data for document:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลสำหรับสร้างเอกสารได้" },
      { status: 500 }
    );
  }
} 