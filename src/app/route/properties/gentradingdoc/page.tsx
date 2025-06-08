"use client";

import { useSearchParams } from "next/navigation";
import GenTradingDoc from "@/components/properties/GenTradingDoc";

export default function GenTradingDocPage() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const userId = searchParams.get("userId");

  if (!propertyId || !userId) {
    let missingParams = [];

    if (!propertyId) {
      missingParams.push("propertyId");
    }

    if (!userId) {
      missingParams.push("userId");
    }

    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">ข้อมูลไม่ครบถ้วน</h2>
        <p className="text-gray-700">
          กรุณาระบุ {missingParams.join(" และ ")} ใน URL เพื่อดำเนินการต่อ
        </p>
        <p className="text-sm text-gray-500 mt-2">
          ตัวอย่าง: /route/properties/gentradingdoc?propertyId=123&userId=456
        </p>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">สร้างสัญญาซื้อขายอสังหาริมทรัพย์</h1>
      <GenTradingDoc propertyId={propertyId} userId={userId} />
    </div>
  );
}