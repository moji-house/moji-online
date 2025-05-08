"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";
import { 
  FaHome, 
  FaMapMarkerAlt, 
  FaCity, 
  FaDollarSign, 
  FaBed, 
  FaBath, 
  FaRuler, 
  FaUpload, 
  FaTrash,
  FaSpinner,
  FaSave,
  FaPhone,
  FaLine,
  FaMap,
  FaGift,
  FaStickyNote
} from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function EditPostForm({ propertyId }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "Bangkok", // Default city
    price: "",
    bedrooms: 1,
    bathrooms: 1,
    area: "",
    status: "for sale", // Default status
    images: [],
    phone: "", // เพิ่มฟิลด์เบอร์โทรศัพท์
    lineId: "", // เพิ่มฟิลด์ Line ID
    googleMapLink: "", // เพิ่มฟิลด์ลิงก์ Google Maps
    coAgentCommission: "", // คอมมิสชั่นสำหรับ Co-Agent
    coAgentIncentive: "", // แรงจูงใจปิดการขาย
    coAgentNotes: "" // ข้อมูลเพิ่มเติมสำหรับ Co-Agent
  });
  
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  
  // ดึงข้อมูลอสังหาริมทรัพย์เดิมมาแสดงในฟอร์ม
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/properties/${propertyId}`);
        const property = response.data;
        
        // ตั้งค่าข้อมูลในฟอร์ม
        setFormData({
          title: property.title || "",
          description: property.description || "",
          address: property.address || "",
          city: property.city || "",
          price: property.price || "",
          bedrooms: property.bedrooms || 1,
          bathrooms: property.bathrooms || 1,
          area: property.area || "",
          status: property.status === "active" ? "for sale" : "for rent",
          images: [],
          phone: property.phone || "",
          lineId: property.line_id || "",
          googleMapLink: property.google_map_link || "",
          coAgentCommission: property.co_agent_commission || "",
          coAgentIncentive: property.co_agent_incentive || "",
          coAgentNotes: property.co_agent_notes || ""
        });
        
        // ตั้งค่ารูปภาพเดิม
        if (property.images && property.images.length > 0) {
          setExistingImages(property.images);
        }
        
      } catch (error) {
        console.error("Error fetching property data:", error);
        toast.error("ไม่สามารถโหลดข้อมูลอสังหาริมทรัพย์ได้");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (propertyId) {
      fetchPropertyData();
    }
  }, [propertyId]);
  
  // ย้ายการ redirect ไปอยู่ใน useEffect เพื่อหลีกเลี่ยงปัญหา render ระหว่าง server และ client
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);
  
  // ถ้ากำลังโหลดหรือยังไม่ได้ล็อกอิน ให้แสดง loading
  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Limit to 30 images
    const totalImages = previewImages.length + files.length;
    if (totalImages > 30) {
      toast.error("คุณสามารถอัปโหลดรูปภาพได้สูงสุด 30 รูป");
      return;
    }
    
    try {
      // Create preview URLs
      const newPreviewImages = [...previewImages];
      const newImages = [...formData.images];
      
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
          continue;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
          continue;
        }
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviewImages.push(e.target.result);
          setPreviewImages([...newPreviewImages]);
        };
        reader.readAsDataURL(file);
        
        // Add to form data
        newImages.push(file);
      }
      
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
      
    } catch (error) {
      console.error('Error handling image upload:', error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
    }
  };
  
  const removeImage = (index) => {
    const newPreviewImages = [...previewImages];
    const newImages = [...formData.images];
    
    newPreviewImages.splice(index, 1);
    newImages.splice(index, 1);
    
    setPreviewImages(newPreviewImages);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };
  
  const removeExistingImage = (index) => {
    const newExistingImages = [...existingImages];
    newExistingImages.splice(index, 1);
    setExistingImages(newExistingImages);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }
    
    if (!formData.area || isNaN(formData.area) || Number(formData.area) <= 0) {
      newErrors.area = "Please enter a valid area";
    }
    
    // Validate contact information
    if (!formData.phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.lineId.trim()) newErrors.lineId = "กรุณากรอก Line ID";
    if (!formData.googleMapLink.trim()) newErrors.googleMapLink = "กรุณากรอกลิงก์ Google Maps";

    // Validate Co-Agent information for Agency
    if (session?.user?.role === "agency") {
      if (!formData.coAgentCommission || isNaN(formData.coAgentCommission) || 
          Number(formData.coAgentCommission) < 0 || Number(formData.coAgentCommission) > 100) {
        newErrors.coAgentCommission = "กรุณากรอกเปอร์เซ็นต์คอมมิสชั่นที่ถูกต้อง (0-100%)";
      }
      if (!formData.coAgentIncentive.trim()) {
        newErrors.coAgentIncentive = "กรุณากรอกแรงจูงใจปิดการขาย";
      }
      if (!formData.coAgentNotes.trim()) {
        newErrors.coAgentNotes = "กรุณากรอกข้อมูลเพิ่มเติมสำหรับ Co-Agent";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // ตรวจสอบความถูกต้องของข้อมูล
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      // ตรวจสอบ session
      if (!session) {
        toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
        router.push("/api/auth/signin");
        return;
      }

      // ตรวจสอบสิทธิ์ผ่าน API
      const authCheck = await fetch("/api/auth/check");
      if (!authCheck.ok) {
        toast.error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง");
        router.push("/api/auth/signin");
        return;
      }

      // สร้าง FormData object
      const formDataToSend = new FormData();
      
      // เพิ่มข้อมูลพื้นฐาน
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // เพิ่มรูปภาพใหม่
      if (formData.images && formData.images.length > 0) {
        for (const image of formData.images) {
          if (image instanceof File) {
            formDataToSend.append('images', image);
          }
        }
      }

      // เพิ่มรูปภาพเดิมที่ยังไม่ได้ลบ
      if (existingImages && existingImages.length > 0) {
        formDataToSend.append('existingImages', JSON.stringify(existingImages));
      }

      // ส่งข้อมูลไปยัง API
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'เกิดข้อผิดพลาดในการอัปเดตโพสต์');
      }

      toast.success('อัปเดตโพสต์สำเร็จ!');
      router.push(`/route/post/${propertyId}`);
      
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.message || 'เกิดข้อผิดพลาดในการอัปเดตโพสต์');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">แก้ไขประกาศอสังหาริมทรัพย์</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              <FaHome className="inline mr-2" />
              Property Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Modern Apartment in City Center"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          {/* Description */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your property in detail..."
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaMapMarkerAlt className="inline mr-2" />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 123 Main Street"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
          
          {/* City */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaCity className="inline mr-2" />
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Bangkok"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
          
          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaDollarSign className="inline mr-2" />
              Price (THB)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 2500000"
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Status
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="for sale"
                  checked={formData.status === "for sale"}
                  onChange={handleChange}
                  className="mr-2"
                />
                For Sale
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="for rent"
                  checked={formData.status === "for rent"}
                  onChange={handleChange}
                  className="mr-2"
                />
                For Rent
              </label>
            </div>
          </div>
          
          {/* Bedrooms */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaBed className="inline mr-2" />
              Bedrooms
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              min="0"
              max="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Bathrooms */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaBath className="inline mr-2" />
              Bathrooms
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="0"
              max="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Area */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaRuler className="inline mr-2" />
              Area (m²)
            </label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="e.g. 85"
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.area ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
          </div>
          
          {/* Images */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              <FaUpload className="inline mr-2" />
              Property Images (Max 30)
            </label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">รูปภาพเดิม:</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="relative h-32 w-full rounded-lg overflow-hidden">
                        <Image
                          src={image.imageUrl}
                          alt={`Existing ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        aria-label="Remove image"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Upload New Images */}
            <div 
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 ${
                errors.images ? "border-red-500" : "border-gray-300"
              }`}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="hidden"
              />
              <p className="text-gray-500">Click to upload images (or drag and drop)</p>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB each</p>
            </div>
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            
            {/* New Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">รูปภาพใหม่:</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative">
                      <div className="relative h-32 w-full rounded-lg overflow-hidden">
                        <Image
                          src={src}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        aria-label="Remove image"
                      >
                        <FaTrash size={12} />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">ข้อมูลการติดต่อ</h2>
            
            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                <FaPhone className="inline mr-2" />
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="กรอกเบอร์โทรศัพท์"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Line ID */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                <FaLine className="inline mr-2" />
                Line ID
              </label>
              <input
                type="text"
                name="lineId"
                value={formData.lineId}
                onChange={handleChange}
                placeholder="กรอก Line ID"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.lineId ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lineId && <p className="text-red-500 text-sm mt-1">{errors.lineId}</p>}
            </div>

            {/* Google Maps Link */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                <FaMap className="inline mr-2" />
                ลิงก์ Google Maps
              </label>
              <input
                type="url"
                name="googleMapLink"
                value={formData.googleMapLink}
                onChange={handleChange}
                placeholder="วางลิงก์ Google Maps ที่นี่"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.googleMapLink ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.googleMapLink && <p className="text-red-500 text-sm mt-1">{errors.googleMapLink}</p>}
            </div>
          </div>

          {/* Co-Agent Section - แสดงสำหรับทุก role */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">ข้อมูล Co-Agent</h2>
            <p className="text-gray-600 mb-4">กรอกข้อมูลเพิ่มเติมสำหรับ Co-Agent (ไม่บังคับ)</p>
            
            {/* Commission */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                <FaDollarSign className="inline mr-2" />
                คอมมิสชั่นสำหรับ Co-Agent (%)
              </label>
              <input
                type="number"
                name="coAgentCommission"
                value={formData.coAgentCommission}
                onChange={handleChange}
                placeholder="กรอกเปอร์เซ็นต์คอมมิสชั่น (ถ้ามี)"
                min="0"
                max="100"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.coAgentCommission ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.coAgentCommission && <p className="text-red-500 text-sm mt-1">{errors.coAgentCommission}</p>}
            </div>

            {/* Incentive */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                <FaGift className="inline mr-2" />
                แรงจูงใจปิดการขาย
              </label>
              <input
                type="text"
                name="coAgentIncentive"
                value={formData.coAgentIncentive}
                onChange={handleChange}
                placeholder="กรอกแรงจูงใจ เช่น โบนัสพิเศษ หรือของรางวัล (ถ้ามี)"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.coAgentIncentive ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.coAgentIncentive && <p className="text-red-500 text-sm mt-1">{errors.coAgentIncentive}</p>}
            </div>

            {/* Additional Notes */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                <FaStickyNote className="inline mr-2" />
                ข้อมูลเพิ่มเติมสำหรับ Co-Agent
              </label>
              <textarea
                name="coAgentNotes"
                value={formData.coAgentNotes}
                onChange={handleChange}
                placeholder="กรอกข้อมูลเพิ่มเติมที่ Co-Agent ควรทราบ (ถ้ามี)"
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.coAgentNotes ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.coAgentNotes && <p className="text-red-500 text-sm mt-1">{errors.coAgentNotes}</p>}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="col-span-2 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  อัปเดตประกาศ
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
