import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/app/util/serialize";
import { IProperty, IUser } from "@/app/types/backend";
import ISerializedProperty, { ISerializedUser } from "@/app/types/frontend";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const propertyId = (await params).id;
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
      property: property,
      buyer: buyer ? buyer : null,
      seller: property.user
    };

    return NextResponse.json(serializeBigInt(response));
  } catch (error) {
    console.error("Error fetching data for document:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลสำหรับสร้างเอกสารได้" },
      { status: 500 }
    );
  }
}