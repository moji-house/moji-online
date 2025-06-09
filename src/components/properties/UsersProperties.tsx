"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PropertyCard from "@/components/properties/PropertyCard";
import { FaSpinner } from "react-icons/fa";
import ISerializedProperty from "@/app/types/frontend";

export default async function UsersProperties({ userId, limit }: { userId?: string; limit?: number }) {
  const [properties, setProperties] = useState<ISerializedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = userId || (await params).id;

  // Memoize sorted properties
  const sortedProperties = useMemo(() => {
    return [...properties].sort((a, b) => {
      const pointsA = a.points || 0;
      const pointsB = b.points || 0;
      return pointsB - pointsA;
    });
  }, [properties]);

  // Memoize limited properties
  const limitedProperties = useMemo(() => {
    return limit ? sortedProperties.slice(0, limit) : sortedProperties;
  }, [sortedProperties, limit]);

  useEffect(() => {
    const fetchUserProperties = async () => {
      if (!id) {
        setError("ไม่พบข้อมูลผู้ใช้");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/properties/user/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        console.error("Error fetching user properties:", err);
        setError("ไม่สามารถโหลดข้อมูลอสังหาริมทรัพย์ได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchUserProperties();
    }
  }, [id, status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
        <button
          onClick={() => router.push("/route/login/")}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          เข้าสู่ระบบ
        </button>
      </div>
    );
  }

  if (limitedProperties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">ผู้ใช้ยังไม่มีอสังหาริมทรัพย์ที่ลงประกาศ</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">อสังหาริมทรัพย์ของผู้ใช้</h1>
      <div className="grid grid-cols-1 gap-6">
        {limitedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}