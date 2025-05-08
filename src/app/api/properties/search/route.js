import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

// Export config
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Export GET handler
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    // Get filter parameters
    const searchTerm = searchParams.get("searchTerm") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    const city = searchParams.get("city");
    const posterName = searchParams.get("posterName");

    // Build where clause
    const where = {
      AND: [
        searchTerm ? {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { address: { contains: searchTerm, mode: "insensitive" } }
          ]
        } : {},
        minPrice ? { price: { gte: parseFloat(minPrice) } } : {},
        maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {},
        bedrooms ? { bedrooms: parseInt(bedrooms) } : {},
        bathrooms ? { bathrooms: parseInt(bathrooms) } : {},
        minArea ? { square_feet: { gte: parseFloat(minArea) } } : {},
        maxArea ? { square_feet: { lte: parseFloat(maxArea) } } : {},
        city ? { city: { equals: city, mode: "insensitive" } } : {},
        posterName ? {
          user: {
            OR: [
              { firstName: { contains: posterName, mode: "insensitive" } },
              { lastName: { contains: posterName, mode: "insensitive" } }
            ]
          }
        } : {}
      ]
    };

    // Get properties with all necessary data
    const properties = await prisma.property.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            roles: {
              select: {
                role: true
              }
            }
          }
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
            isMain: true
          }
        },
        votes: {
          select: {
            id: true,
            voteType: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: [
        { points: "desc" },
        { createdAt: "desc" }
      ]
    });

    // Get unique cities
    const cities = await prisma.property.findMany({
      select: {
        city: true
      },
      distinct: ["city"],
      where: {
        city: {
          not: null,
          not: ""
        }
      }
    });

    // Get unique posters
    const posters = await prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true
      },
      where: {
        properties: {
          some: {}
        }
      },
      orderBy: {
        firstName: "asc"
      }
    });

    const response = {
      properties: serializeBigInt(properties),
      cities: cities.map(c => c.city).filter(Boolean),
      posters: posters.map(p => `${p.firstName} ${p.lastName}`)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in search properties:", error);
    return NextResponse.json(
      { error: "ไม่สามารถค้นหาอสังหาริมทรัพย์ได้" },
      { status: 500 }
    );
  }
} 