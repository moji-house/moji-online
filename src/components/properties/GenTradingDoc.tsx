"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaFilePdf, FaFileContract } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { IGenDocType } from "@/app/types/frontend";

export default function GenTradingDoc({ propertyId, userId }: { propertyId: string, userId: string }) {
  const [data, setData] = useState<IGenDocType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [buyerSignature, setBuyerSignature] = useState(null);
  const [sellerSignature, setSellerSignature] = useState(null);
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerIdCard: "",
    buyerAddress: "",
    buyerPhone: "",
    sellerName: "",
    sellerIdCard: "",
    sellerAddress: "",
    sellerPhone: "",
    propertyPrice: "",
    propertyAddress: "",
    propertySize: "",
    propertyType: "",
    depositAmount: "",
    paymentTerms: "",
    transferDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/properties/${propertyId}/genDoc?userId=${userId}`
        );
        const result = await response.json();

        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
          // เติมข้อมูลเริ่มต้นจาก API
          setFormData((prev) => ({
            ...prev,
            buyerName: result.buyer
              ? `${result.buyer.firstName} ${result.buyer.lastName}`
              : "",
            buyerIdCard: result.buyer?.idCard || "",
            buyerAddress: result.buyer?.address || "",
            buyerPhone: result.buyer?.phone || "",
            sellerName: result.seller
              ? `${result.seller.firstName} ${result.seller.lastName}`
              : "",
            sellerIdCard: result.seller?.idCard || "",
            sellerAddress: result.seller?.address || "",
            sellerPhone: result.seller?.phone || "",
            propertyPrice: result.property.price,
            propertyAddress: result.property.address,
            propertySize: result.property.square_feet,
            propertyType: result.property.type,
          }));
        }
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchData();
    }
  }, [propertyId, userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateContract = async () => {
    try {
      // ส่งข้อมูลไปยัง API เพื่อสร้าง PDF
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          propertyId,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการสร้างสัญญา");
      }

      // ดึง PDF จาก response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // เปิด PDF ในหน้าต่างใหม่
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating contract:", error);
      alert("เกิดข้อผิดพลาดในการสร้างสัญญา");
    }
  };



  const handleSignUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ตรวจสอบประเภทไฟล์
    if (!file.type.match(/image\/(jpeg|png|gif)/)) {
      alert("กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น (JPEG, PNG, GIF)");
      return;
    }

    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("ขนาดไฟล์ไม่ควรเกิน 2MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type); // 'buyer' หรือ 'seller'
      formData.append('propertyId', propertyId);

      const response = await fetch('/api/upload/signature', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('เกิดข้อผิดพลาดในการอัพโหลดลายเซ็นต์');
      }

      const result = await response.json();

      // อัพเดท state ตามประเภทลายเซ็นต์
      if (type === 'buyer') {
        setBuyerSignature(result.url);
      } else {
        setSellerSignature(result.url);
      }

      toast.success('อัพโหลดลายเซ็นต์สำเร็จ');
    } catch (error) {
      console.error('Error uploading signature:', error);
      toast.error('เกิดข้อผิดพลาดในการอัพโหลดลายเซ็นต์');
    }

  };
  if (loading) {
    return <div className="text-center">กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* สัญญาซื้อขาย */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">สัญญาซื้อขายอสังหาริมทรัพย์</h2>

        <div className="space-y-4">
          {/* ข้อมูลผู้ซื้อ */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">ข้อมูลผู้ซื้อ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  เลขประจำตัวประชาชน
                </label>
                <input
                  type="text"
                  name="buyerIdCard"
                  value={formData.buyerIdCard}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ที่อยู่
                </label>
                <input
                  type="text"
                  name="buyerAddress"
                  value={formData.buyerAddress}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="text"
                  name="buyerPhone"
                  value={formData.buyerPhone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลผู้ขาย */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">ข้อมูลผู้ขาย</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  name="sellerName"
                  value={formData.sellerName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  เลขประจำตัวประชาชน
                </label>
                <input
                  type="text"
                  name="sellerIdCard"
                  value={formData.sellerIdCard}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ที่อยู่
                </label>
                <input
                  type="text"
                  name="sellerAddress"
                  value={formData.sellerAddress}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="text"
                  name="sellerPhone"
                  value={formData.sellerPhone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลอสังหาริมทรัพย์ */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">ข้อมูลอสังหาริมทรัพย์</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ราคา
                </label>
                <input
                  type="text"
                  name="propertyPrice"
                  value={formData.propertyPrice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ที่อยู่
                </label>
                <input
                  type="text"
                  name="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ขนาดพื้นที่
                </label>
                <input
                  type="text"
                  name="propertySize"
                  value={formData.propertySize}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ประเภท
                </label>
                <input
                  type="text"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* เงื่อนไขการซื้อขาย */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">เงื่อนไขการซื้อขาย</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  เงินมัดจำ
                </label>
                <input
                  type="text"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  เงื่อนไขการชำระเงิน
                </label>
                <input
                  type="text"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  วันที่โอนกรรมสิทธิ์
                </label>
                <input
                  type="date"
                  name="transferDate"
                  value={formData.transferDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ลายเซ็นต์ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ลายเซ็นต์ผู้ซื้อ */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">ลายเซ็นต์ผู้ซื้อ</h3>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg">
              {buyerSignature ? (
                <Image
                  src={buyerSignature}
                  alt="ลายเซ็นต์ผู้ซื้อ"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSignUpload(e, 'buyer')}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-2 text-gray-500">
                      <FaFilePdf className="text-xl" />
                      <span>อัพโหลดลายเซ็นต์</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="font-medium">({formData.buyerName})</p>
              <p className="text-sm text-gray-500">ผู้ซื้อ</p>
            </div>
          </div>
        </div>

        {/* ลายเซ็นต์ผู้ขาย */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">ลายเซ็นต์ผู้ขาย</h3>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg">
              {sellerSignature ? (
                <Image
                  src={sellerSignature}
                  alt="ลายเซ็นต์ผู้ขาย"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSignUpload(e, 'seller')}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-2 text-gray-500">
                      <FaFilePdf className="text-xl" />
                      <span>อัพโหลดลายเซ็นต์</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="font-medium">({formData.sellerName})</p>
              <p className="text-sm text-gray-500">ผู้ขาย</p>
            </div>
          </div>
        </div>
      </div>

      {/* รูปภาพอสังหาริมทรัพย์ */}
      {data?.property?.images && data.property.images.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">รูปภาพอสังหาริมทรัพย์</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.property.images.map((image) => (
              <div key={image.id} className="relative h-48">
                <Image
                  src={image.imageUrl}
                  alt={`Property Image ${image.id}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* เอกสารประกอบ */}
      {data?.property?.documents && data.property.documents.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">เอกสารประกอบ</h2>
            <button
              onClick={() => setShowDocumentsModal(true)}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FaFileContract className="text-xl" />
              <span>ดูเอกสารทั้งหมด</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.property.documents.slice(0, 2).map((doc, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaFileContract className="text-gray-500" />
                    <span className="font-medium">เอกสารที่ {index + 1}</span>
                  </div>
                  <a
                    href={doc.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    ดูเอกสาร
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ปุ่มสร้างสัญญา */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleGenerateContract}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <FaFilePdf className="text-xl" />
          <span>สร้างสัญญา</span>
        </button>
      </div>

      {/* Documents Modal */}
      {showDocumentsModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">เอกสารประกอบ</h3>
              <button
                onClick={() => setShowDocumentsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {data?.property?.documents?.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaFileContract className="text-gray-500" />
                      <span className="font-medium">เอกสารที่ {index + 1}</span>
                    </div>
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      ดูเอกสาร
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
