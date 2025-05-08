"use client";

import { useSearchParams } from "next/navigation";
import GenTradingDoc from "@/components/properties/GenTradingDoc";

export default function GenTradingDocPage() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const userId = searchParams.get("userId");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">สร้างสัญญาซื้อขายอสังหาริมทรัพย์</h1>
      <GenTradingDoc propertyId={propertyId} userId={userId} />
    </div>
  );
} 