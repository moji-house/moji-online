"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaBed,
  FaBath,
  FaRuler,
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaComment,
  FaImages,
  FaEdit,
  FaClock,
  FaShare,
  FaFacebook,
  FaLine,
  FaLink,
  FaSave,
  FaRegSave,
  FaFileContract,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PointsDisplay from "../points/PointsDisplay";
import Comments from "../comments/Comments";
import { useUserProfile } from "@/context/UserProfileContext";

export default function PropertyCard({ property }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [propertyData, setPropertyData] = useState(property);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { userProfiles } = useUserProfile();
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await fetch(`/api/properties/${property.id}`);
        if (response.ok) {
          const data = await response.json();
          setPropertyData(data);
          setLikeCount(data.likes?.length || 0);

          const UserProfile = userProfiles.find(
            (profile) => profile.email === session?.user?.email
          );
          setCurrentUserProfile(UserProfile);
          // ตรวจสอบว่าผู้ใช้ปัจจุบันได้กดไลค์หรือยัง
          if (UserProfile?.id) {
            const isUserLiked = data.likes?.some(
              (like) => like.userId === UserProfile.id
            );
            setIsLiked(isUserLiked);
          }
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    if (property?.id) {
      fetchPropertyData();
    }
  }, [property?.id, session?.user?.id]);

  if (!propertyData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 h-full">
        <p>Property data not available</p>
      </div>
    );
  }

  // ฟังก์ชันแชร์
  const handleShare = () => {
    setShowShareModal(true);
  };

  const shareOnLine = () => {
    const url = `${window.location.origin}/route/post/${property.id}`;
    window.open(`https://line.me/R/share?url=${encodeURIComponent(url)}`, '_blank');
    setShowShareModal(false);
  };

  const shareOnFacebook = () => {
    const url = `${window.location.origin}/route/post/${property.id}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setShowShareModal(false);
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/route/post/${property.id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('คัดลอก URL เรียบร้อยแล้ว');
      setShowShareModal(false);
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      return router.push("/api/auth/signin");
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/properties/${propertyData.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: propertyData.id,
          userId: session.user.id,
        }),
      });

      if (response.ok) {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikeCount((prevCount) =>
          newLikedState ? prevCount + 1 : prevCount - 1
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComments = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowComments(!showComments);
  };

  // ตรวจสอบว่ามีรูปภาพหรือไม่
  const hasImages = propertyData.images && propertyData.images.length > 0;
  // จำนวนรูปภาพทั้งหมด
  const totalImages = hasImages ? propertyData.images.length : 0;
  // จำนวนรูปภาพที่เหลือ (ถ้ามีมากกว่า 3 รูป)
  const remainingImages = totalImages > 3 ? totalImages - 3 : 0;
  // รูปภาพที่จะแสดง (ไม่เกิน 3 รูป)
  const displayImages = hasImages ? propertyData.images.slice(0, 3) : [];

  // ฟังก์ชันสำหรับจัดรูปแบบวันที่
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleDateString("th-TH", options);
  };

  // ฟังก์ชันบันทึกอสังหาริมทรัพย์
  const handleSaveProperty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      return router.push("/api/auth/signin");
    }

    try {
      setIsSaving(true);
      const response = await fetch(`/api/properties/${propertyData.id}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: propertyData.id,
          userId: session.user.id,
        }),
      });

      if (response.ok) {
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);
        // อาจจะเพิ่มการแสดง alert หรือ toast message ว่าบันทึกสำเร็จ
        alert(newSavedState ? 'บันทึกอสังหาริมทรัพย์เรียบร้อยแล้ว' : 'ยกเลิกการบันทึกเรียบร้อยแล้ว');
      }
    } catch (error) {
      console.error("Error saving property:", error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateDoc = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/route/properties/gentradingdoc?propertyId=${propertyData.id}&userId=${userProfiles?.id}`);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.01] transition-transform">
      <PointsDisplay points={propertyData.points} propertyData={propertyData} />

      {/* Property Images - แสดงเฉพาะเมื่อมีรูปภาพ */}
      {propertyData.images && propertyData.images.length > 0 && (
        <div className="relative h-48 sm:h-56 md:h-64 w-full">
          <Link href={`/route/post/${propertyData.id}`}>
            {hasImages ? (
              <>
                {/* กรณีมีน้อยกว่า 3 ภาพ ให้แสดงภาพเต็มพื้นที่ */}
                {totalImages < 3 ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={displayImages[0].imageUrl}
                      alt={propertyData.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority
                    />

                    {/* ถ้ามี 2 ภาพ ให้แสดงภาพที่ 2 ด้วย */}
                    {totalImages === 2 && (
                      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 m-2 border-2 border-white overflow-hidden rounded-md">
                        <Image
                          src={displayImages[1].imageUrl}
                          alt={`${propertyData.title} - Image 2`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  /* กรณีมี 3 ภาพขึ้นไป ให้แสดงแบบ grid */
                  <div className="grid grid-cols-2 grid-rows-2 h-full">
                    {/* รูปแรก (ใหญ่) */}
                    <div className="col-span-1 row-span-2 relative">
                      <Image
                        src={displayImages[0].imageUrl}
                        alt={`${propertyData.title} - Image 1`}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>

                    {/* รูปที่ 2 */}
                    <div className="col-span-1 row-span-1 relative">
                      <Image
                        src={displayImages[1].imageUrl}
                        alt={`${propertyData.title} - Image 2`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* รูปที่ 3 หรือแสดงจำนวนรูปที่เหลือ */}
                    <div className="col-span-1 row-span-1 relative">
                      <Image
                        src={displayImages[2].imageUrl}
                        alt={`${propertyData.title} - Image 3`}
                        fill
                        className="object-cover"
                      />

                      {/* แสดงจำนวนรูปที่เหลือ */}
                      {remainingImages > 0 && (
                        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center text-white">
                          <div className="flex items-center">
                            <FaImages className="mr-1" />
                            <span>+{remainingImages}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </Link>

          {/* Property Type Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                propertyData.status === "for sale"
                  ? "bg-blue-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {propertyData.status === "for sale" ? "For Sale" : "For Rent"}
            </span>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            disabled={isLoading}
            className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            aria-label={isLiked ? "Unlike property" : "Like property"}
          >
            {isLiked ? (
              <FaHeart className="text-red-500 text-lg" />
            ) : (
              <FaRegHeart className="text-gray-500 text-lg" />
            )}
          </button>

          {/* Save Property Button */}
          <button
            onClick={handleSaveProperty}
            disabled={isSaving}
            className="absolute top-3 right-12 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            aria-label={isSaved ? "Unsave property" : "Save property"}
          >
            {isSaved ? (
              <FaSave className="text-blue-500 text-lg" />
            ) : (
              <FaRegSave className="text-gray-500 text-lg" />
            )}
          </button>
        </div>
      )}

      {/* แสดง Property Type Badge และ Like Button แยกต่างหากเมื่อไม่มีรูปภาพ */}
      {(!propertyData.images || propertyData.images.length === 0) && (
        <div className="relative p-4 bg-gray-100">
          <div className="flex justify-between items-center">
            {/* Property Type Badge */}
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  propertyData.status === "for sale"
                    ? "bg-blue-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {propertyData.status === "for sale" ? "For Sale" : "For Rent"}
              </span>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLikeClick}
              disabled={isLoading}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
              aria-label={isLiked ? "Unlike property" : "Like property"}
            >
              {isLiked ? (
                <FaHeart className="text-red-500 text-lg" />
              ) : (
                <FaRegHeart className="text-gray-500 text-lg" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Property Details */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <Link
            href={`/route/post/${propertyData.id}`}
            className="hover:underline"
          >
            <h3 className="text-xl font-semibold">{propertyData.title}</h3>
          </Link>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="mr-1 text-blue-500" />
          <p className="text-sm line-clamp-1">
            {propertyData.address}, {propertyData.city}
          </p>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {propertyData.description}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(propertyData.price)}
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleComments}
                className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
              >
                <FaComment className="mr-1" />
                <span className="text-sm text-gray-500">
                  {propertyData.comments?.length || 0}
                </span>
              </button>
              <span className="mx-1">•</span>
              <button
                onClick={handleLikeClick}
                disabled={isLoading}
                className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
              >
                {isLiked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-400" />
                )}
                <span className="text-sm text-gray-500 ml-1">{likeCount}</span>
              </button>
              <span className="mx-1">•</span>
              <button
                onClick={handleShare}
                className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
              >
                <FaShare className="text-gray-400" />
                <span className="text-sm text-gray-500 ml-1">แชร์</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between text-gray-600 border-t pt-3">
            <div className="flex items-center">
              <FaBed className="mr-1" />
              <span className="text-sm">{propertyData.bedrooms} Beds</span>
            </div>
            <div className="flex items-center">
              <FaBath className="mr-1" />
              <span className="text-sm">{propertyData.bathrooms} Baths</span>
            </div>
            <div className="flex items-center">
              <FaRuler className="mr-1" />
              <span className="text-sm">{propertyData.square_feet} m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Property Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center">
          {propertyData.user?.avatar ? (
            <Image
              src={propertyData.user.avatar}
              alt={`${propertyData.user.firstName} ${propertyData.user.lastName}`}
              width={24}
              height={24}
              className="rounded-full mr-2"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <span className="text-xs text-blue-500 font-bold">
                {propertyData.user?.firstName?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-600">
            Posted by {propertyData.user?.firstName}{" "}
            {propertyData.user?.lastName}
          </span>

          {/* แสดงวันที่สร้าง */}
          <FaClock className="flex items-left text-gray-500 text-xs mx-5 mt-3 mb-3 mr-1" />
          <span className="flex items-left text-gray-500 text-xs mt-3 mb-3">
            {formatDate(propertyData.createdAt)}
          </span>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100">
          <Comments
            propertyId={propertyData.id}
            initialComments={propertyData.comments || []}
          />
        </div>
      )}

       {/* Share Modal */}
       {showShareModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">แชร์อสังหาริมทรัพย์</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={shareOnLine}
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaLine className="text-xl" />
                แชร์บน Line
              </button>
              <button
                onClick={shareOnFacebook}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaFacebook className="text-xl" />
                แชร์บน Facebook
              </button>
              <button
                onClick={copyUrl}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaLink className="text-xl" />
                คัดลอก URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
