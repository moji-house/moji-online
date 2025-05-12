"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
  FaStickyNote,
  FaVideo,
  FaFilePdf,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useUserProfile } from "@/context/UserProfileContext";

export default function CreatePostForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { userProfiles, fetchProfiles } = useUserProfile();

  // หา current user profile
  const currentUserProfile = userProfiles?.find(
    (profile) => profile.email === session?.user?.email
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "", // Default city
    price: "",
    bedrooms: 1,
    bathrooms: 1,
    area: "",
    status: "for sale", // Default status
    images: [],
    phone: currentUserProfile?.phone || "", // เพิ่มค่าเริ่มต้นจาก session
    lineId: currentUserProfile?.lineContact || "", // เพิ่มค่าเริ่มต้นจาก session
    googleMapLink: "", // เพิ่มฟิลด์ลิงก์ Google Maps
    coAgentCommission: "", // คอมมิสชั่นสำหรับ Co-Agent
    coAgentIncentive: "", // แรงจูงใจปิดการขาย
    coAgentNotes: "", // ข้อมูลเพิ่มเติมสำหรับ Co-Agent
    videos: [],
    documents: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideos, setPreviewVideos] = useState([]);
  const [previewDocuments, setPreviewDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // ย้ายการ redirect ไปอยู่ใน useEffect เพื่อหลีกเลี่ยงปัญหา render ระหว่าง server และ client
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  // ถ้ากำลังโหลดหรือยังไม่ได้ล็อกอิน ให้แสดง loading
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Limit to 30 images
    const totalImages = previewImages.length + files.length;
    if (totalImages > 30) {
      alert("You can upload maximum 30 images");
      return;
    }

    // Create preview URLs
    const newPreviewImages = [...previewImages];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviewImages.push(e.target.result);
        setPreviewImages([...newPreviewImages]);
      };
      reader.readAsDataURL(file);
    });

    // Add to form data
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index) => {
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);

    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // ตรวจสอบประเภทไฟล์
    const invalidFiles = files.filter((file) => !file.type.includes("video"));
    if (invalidFiles.length > 0) {
      alert("กรุณาอัพโหลดไฟล์วิดีโอเท่านั้น");
      return;
    }

    // Limit to 5 videos
    const totalVideos = previewVideos.length + files.length;
    if (totalVideos > 5) {
      alert("You can upload maximum 5 videos");
      return;
    }

    // Create preview URLs
    const newPreviewVideos = [...previewVideos];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviewVideos.push({
          url: e.target.result,
          name: file.name,
        });
        setPreviewVideos([...newPreviewVideos]);
      };
      reader.readAsDataURL(file);
    });

    // Add to form data
    setFormData((prev) => ({
      ...prev,
      videos: [...prev.videos, ...files],
    }));
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // ตรวจสอบประเภทไฟล์
    const invalidFiles = files.filter((file) => !file.type.includes("pdf"));
    if (invalidFiles.length > 0) {
      alert("กรุณาอัพโหลดไฟล์ PDF เท่านั้น");
      return;
    }

    // Limit to 10 documents
    const totalDocuments = previewDocuments.length + files.length;
    if (totalDocuments > 10) {
      alert("You can upload maximum 10 documents");
      return;
    }

    // Create preview list
    const newPreviewDocuments = [...previewDocuments];

    files.forEach((file) => {
      newPreviewDocuments.push({
        name: file.name,
        size: file.size,
      });
    });

    setPreviewDocuments([...newPreviewDocuments]);

    // Add to form data
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  const removeVideo = (index) => {
    const newPreviewVideos = [...previewVideos];
    newPreviewVideos.splice(index, 1);
    setPreviewVideos(newPreviewVideos);

    const newVideos = [...formData.videos];
    newVideos.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      videos: newVideos,
    }));
  };

  const removeDocument = (index) => {
    const newPreviewDocuments = [...previewDocuments];
    newPreviewDocuments.splice(index, 1);
    setPreviewDocuments(newPreviewDocuments);

    const newDocuments = [...formData.documents];
    newDocuments.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      documents: newDocuments,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";

    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.area || isNaN(formData.area) || Number(formData.area) <= 0) {
      newErrors.area = "Please enter a valid area";
    }

    // Validate contact information
    if (!formData.phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.lineId.trim()) newErrors.lineId = "กรุณากรอก Line ID";

    // Validate Co-Agent information for Agency
    if (session?.user?.role === "agency") {
      if (
        !formData.coAgentCommission ||
        isNaN(formData.coAgentCommission) ||
        Number(formData.coAgentCommission) < 0 ||
        Number(formData.coAgentCommission) > 100
      ) {
        newErrors.coAgentCommission =
          "กรุณากรอกเปอร์เซ็นต์คอมมิสชั่นที่ถูกต้อง (0-100%)";
      }
      if (!formData.coAgentIncentive.trim()) {
        newErrors.coAgentIncentive = "กรุณากรอกแรงจูงใจปิดการขาย";
      }
      if (!formData.coAgentNotes.trim()) {
        newErrors.coAgentNotes = "กรุณากรอกข้อมูลเพิ่มเติมสำหรับ Co-Agent";
      }
    }

    // ตรวจสอบการอัพโหลดรูปภาพ
    if (formData.images.length === 0) {
      newErrors.images = "กรุณาอัพโหลดรูปภาพอย่างน้อย 1 รูป";
    }

    // ตรวจสอบการอัพโหลดวิดีโอ (ถ้ามี)
    if (formData.videos.length > 0) {
      const invalidVideos = formData.videos.filter(
        (file) => !file.type.includes("video")
      );
      if (invalidVideos.length > 0) {
        newErrors.videos = "กรุณาอัพโหลดไฟล์วิดีโอเท่านั้น";
      }
    }

    // ตรวจสอบการอัพโหลดเอกสาร (ถ้ามี)
    if (formData.documents.length > 0) {
      const invalidDocuments = formData.documents.filter(
        (file) => !file.type.includes("pdf")
      );
      if (invalidDocuments.length > 0) {
        newErrors.documents = "กรุณาอัพโหลดไฟล์ PDF เท่านั้น";
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

      // สร้าง FormData object
      const formDataToSend = new FormData();

      // เพิ่มข้อมูลพื้นฐาน
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("bedrooms", Number(formData.bedrooms));
      formDataToSend.append("bathrooms", Number(formData.bathrooms));
      formDataToSend.append("area", Number(formData.area));
      formDataToSend.append(
        "status",
        formData.status === "for sale" ? "active" : "rent"
      );
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("lineId", formData.lineId);
      formDataToSend.append("googleMapLink", formData.googleMapLink);

      // เพิ่มข้อมูล Co-Agent (ถ้ามี)
      if (formData.coAgentCommission) {
        formDataToSend.append(
          "coAgentCommission",
          Number(formData.coAgentCommission)
        );
      }
      if (formData.coAgentIncentive) {
        formDataToSend.append("coAgentIncentive", formData.coAgentIncentive);
      }
      if (formData.coAgentNotes) {
        formDataToSend.append("coAgentNotes", formData.coAgentNotes);
      }

      // เพิ่มรูปภาพ (บังคับ)
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSend.append("images", image);
        });
      }

      // เพิ่มวิดีโอ (ถ้ามี)
      if (formData.videos && formData.videos.length > 0) {
        formData.videos.forEach((video) => {
          formDataToSend.append("videos", video);
        });
      }

      // เพิ่มเอกสาร (ถ้ามี)
      if (formData.documents && formData.documents.length > 0) {
        formData.documents.forEach((doc) => {
          formDataToSend.append("documents", doc);
        });
      }

      // ส่งข้อมูลไปยัง API
      const response = await fetch("/api/properties", {
        method: "POST",
        body: formDataToSend,
      });

      console.log("API Response125:", response);

      if (response.ok) {
        const data = await response.json();
        toast.success("สร้างประกาศสำเร็จ!");

        // อัพเดท coins หลังจากสร้างประกาศสำเร็จ
        try {
          const coinResponse = await fetch("/api/coins", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: session?.user?.id,
              amount: 5000,
              type: "reward",
              description: `ลงประกาศขาย`,
              propertyId: data.propertyId,
            }),
          });

          if (coinResponse.ok) {
            const coinData = await coinResponse.json();
            toast.success(
              `ได้รับ 5,000 coins สำหรับการลงประกาศ! (ยอดคงเหลือ: ${coinData.balance} coins)`
            );
            await fetchProfiles()
          }
        } catch (error) {
          console.error("Error updating coins:", error);
        }

        // Navigate to the property detail page
        router.push(`/route/post/${data.propertyId}`);
      } else {
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          data: response,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการสร้างประกาศ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800"></h1>

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
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
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
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
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
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
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
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
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
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
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
            {errors.area && (
              <p className="text-red-500 text-sm mt-1">{errors.area}</p>
            )}
          </div>

          {/* Images */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              <FaUpload className="inline mr-2" />
              Property Images (Max 30)
            </label>
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
              <p className="text-gray-500">
                Click to upload images (or drag and drop)
              </p>
              <p className="text-sm text-gray-400 mt-1">
                PNG, JPG, WEBP up to 5MB each
              </p>
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
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
            )}
          </div>

          {/* Video Upload Section */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              <FaVideo className="inline mr-2" />
              Property Videos (Max 5)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 ${
                errors.videos ? "border-red-500" : "border-gray-300"
              }`}
              onClick={() => document.getElementById("video-upload").click()}
            >
              <input
                type="file"
                id="video-upload"
                onChange={handleVideoUpload}
                multiple
                accept="video/*"
                className="hidden"
              />
              <p className="text-gray-500">
                Click to upload videos (or drag and drop)
              </p>
              <p className="text-sm text-gray-400 mt-1">
                MP4, MOV, AVI up to 5 files
              </p>
            </div>
            {errors.videos && (
              <p className="text-red-500 text-sm mt-1">{errors.videos}</p>
            )}

            {/* Video Previews */}
            {previewVideos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {previewVideos.map((video, index) => (
                  <div key={index} className="relative">
                    <div className="relative h-32 w-full rounded-lg overflow-hidden">
                      <video
                        src={video.url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      aria-label="Remove video"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Upload Section */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              <FaFilePdf className="inline mr-2" />
              Property Documents (Max 10)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 ${
                errors.documents ? "border-red-500" : "border-gray-300"
              }`}
              onClick={() => document.getElementById("document-upload").click()}
            >
              <input
                type="file"
                id="document-upload"
                onChange={handleDocumentUpload}
                multiple
                accept=".pdf"
                className="hidden"
              />
              <p className="text-gray-500">
                Click to upload documents (or drag and drop)
              </p>
              <p className="text-sm text-gray-400 mt-1">PDF up to 10 files</p>
            </div>
            {errors.documents && (
              <p className="text-red-500 text-sm mt-1">{errors.documents}</p>
            )}

            {/* Document List */}
            {previewDocuments.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {previewDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="relative bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex items-center">
                      <FaFilePdf className="text-red-500 mr-2" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                      aria-label="Remove document"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              ข้อมูลการติดต่อ
            </h2>

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
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
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
              {errors.lineId && (
                <p className="text-red-500 text-sm mt-1">{errors.lineId}</p>
              )}
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
              {errors.googleMapLink && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.googleMapLink}
                </p>
              )}
            </div>
          </div>

          {/* Co-Agent Section - แสดงสำหรับทุก role */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              ข้อมูล Co-Agent
            </h2>
            <p className="text-gray-600 mb-4">
              กรอกข้อมูลเพิ่มเติมสำหรับ Co-Agent (ไม่บังคับ)
            </p>

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
                  errors.coAgentCommission
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.coAgentCommission && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coAgentCommission}
                </p>
              )}
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
              {errors.coAgentIncentive && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coAgentIncentive}
                </p>
              )}
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
              {errors.coAgentNotes && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coAgentNotes}
                </p>
              )}
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
                  Submitting...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Create Property Listing
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
