"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserProfile } from "@/context/UserProfileContext";
import PropertyCard from "@/components/properties/PropertyCard";
import { FaSpinner } from "react-icons/fa";

export default function MyProperties({ limit }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const { userProfiles } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        setLoading(true);
        
        // ตรวจสอบว่ามีการล็อกอินหรือไม่
        if (status === "unauthenticated") {
          router.push("/route/login/");
          return;
        }

        // รอให้ session โหลดเสร็จ
        if (status === "loading") {
          return;
        }

        // ตรวจสอบว่ามี userProfiles หรือไม่
        if (!userProfiles || userProfiles.length === 0) {
          setError("ไม่พบข้อมูลผู้ใช้ กรุณาลองเข้าสู่ระบบใหม่อีกครั้ง");
          setLoading(false);
          return;
        }

        // หา user profile จาก session
        const currentUserProfile = userProfiles.find(
          (profile) => profile.email === session?.user?.email
        );

        if (!currentUserProfile) {
          setError("ไม่พบข้อมูลผู้ใช้");
          setLoading(false);
          return;
        }

        // ดึงข้อมูลอสังหาริมทรัพย์ของผู้ใช้
        const response = await axios.get(`/api/properties/user/${currentUserProfile.id}`);
        
        // เรียงลำดับตามคะแนน (สูงสุดก่อน)
        const sortedProperties = response.data.sort((a, b) => {
          const pointsA = a.points || 0;
          const pointsB = b.points || 0;
          return pointsB - pointsA;
        });
        
        // จำกัดจำนวนโพสต์ที่แสดง (ถ้ามีการกำหนด limit)
        const limitedProperties = limit ? sortedProperties.slice(0, limit) : sortedProperties;
        
        setProperties(limitedProperties);
      } catch (err) {
        console.error("Error fetching my properties:", err);
        setError("ไม่สามารถโหลดข้อมูลอสังหาริมทรัพย์ได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, [session, status, userProfiles, router, limit]);

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

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">คุณยังไม่มีอสังหาริมทรัพย์ที่ลงประกาศ</p>
        <button 
          onClick={() => router.push("/route/properties/create")}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          ลงประกาศอสังหาริมทรัพย์
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="text-2xl font-bold mb-6">อสังหาริมทรัพย์ของฉัน</h1> */}
      <div className="grid grid-cols-1 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}