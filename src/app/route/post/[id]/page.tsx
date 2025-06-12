"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  FaBed,
  FaBath,
  FaRuler,
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaComment,
  FaEdit,
  FaClock,
  FaTrash,
  FaShare,
  FaFacebook,
  FaLine,
  FaLink,
  FaFileContract,
  FaBookmark,
  FaRegSave,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PointsDisplay from "../../../../components/points/PointsDisplay";
import Comments from "../../../../components/comments/Comments";
import { IUserProfile, useUserProfile } from "@/context/UserProfileContext";
import { toast } from "react-hot-toast";
import { formatDate, formatPrice } from "@/app/util/serialize";
import ISerializedProperty, { ISerializedUser } from "@/app/types/frontend";

export default function PropertyCard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [property, setProperty] = useState<ISerializedProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propertyOwner, setPropertyOwner] = useState<IUserProfile | null>(
    null
  );
  const [currentUserProfile, setCurrentUserProfile] =
    useState<IUserProfile | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  const [isLiked, setIsLiked] = useState<Boolean>(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const { userProfiles } = useUserProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData: ISerializedProperty = await response.json();
        setProperty(responseData);
        setLikeCount(responseData.likes?.length || 0);

        // หาเจ้าของอสังหาริมทรัพย์จาก userProfiles
        const owner = userProfiles.find(
          (profile) => profile.id === responseData.userId
        );
        setPropertyOwner(owner || null);

        const userProfile = userProfiles.find(
          (profile) => profile.email === session?.user?.email
        );
        setCurrentUserProfile(userProfile || null);

        // ตรวจสอบว่าผู้ใช้ปัจจุบันได้กดไลค์หรือยัง
        if (userProfile?.id) {
          const isUserLiked = responseData.likes?.some(
            (like) => like.userId === userProfile.id
          );
          setIsLiked(Boolean(isUserLiked));
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProperty();
    }
  }, [id, session, userProfiles]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!property) {
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
    window.open(
      `https://line.me/R/share?url=${encodeURIComponent(url)}`,
      "_blank"
    );
    setShowShareModal(false);
  };

  const shareOnFacebook = () => {
    const url = `${window.location.origin}/route/post/${property.id}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
    setShowShareModal(false);
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/route/post/${property.id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("คัดลอก URL เรียบร้อยแล้ว");
      setShowShareModal(false);
    });
  };

  const handleLikeClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/properties/${property.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.id,
        }),
      });

      if (response.ok) {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikeCount((prevCount) =>
          newLikedState ? prevCount + 1 : prevCount - 1
        );
      } else if (response.status === 401) {
        router.push("/api/auth/signin");
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      if (error.response?.status === 401) {
        router.push("/api/auth/signin");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const toggleComments = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const handleDeleteProperty = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/properties/${property.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("ลบประกาศเรียบร้อยแล้ว");
        router.push("/route/properties/myproperties");
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("เกิดข้อผิดพลาดในการลบประกาศ");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSaveProperty = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session || !session.user) {
      return router.push("/api/auth/signin");
    }

    try {
      setIsSaving(true);
      const response = await fetch(`/api/properties/${property.id}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.id,
        }),
      });

      if (response.ok) {
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);
        toast.success(
          newSavedState
            ? "บันทึกอสังหาริมทรัพย์เรียบร้อยแล้ว"
            : "ยกเลิกการบันทึกเรียบร้อยแล้ว"
        );
      }
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.01] transition-transform">
      <PointsDisplay propertyData={property} />

      {/* Property Images */}
      <div className="relative w-full">
        <div className="flex flex-col gap-4 p-4">
          {/* แสดงวิดีโอ */}
          {property.videos && property.videos.length > 0 && (
            <div className="relative h-[400px] w-full">
              <video
                src={property.videos[0].videoUrl}
                controls
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* แสดงรูปภาพ */}
          {property.images &&
            property.images.map((image, index) => (
              <div key={index} className="relative h-[400px] w-full">
                <Image
                  src={image.imageUrl}
                  alt={`${property.title} - Image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  priority={index === 0}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Property Status and Like Button */}
      <div className="px-4 flex justify-between items-center mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            property.status === "for sale"
              ? "bg-blue-600 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {property.status === "for sale" ? "For Sale" : "For Rent"}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveProperty}
            disabled={isSaving}
            className="flex items-center gap-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            aria-label={isSaved ? "Unsave property" : "Save property"}
          >
            {isSaved ? (
              <FaBookmark className="text-blue-500 text-lg" />
            ) : (
              <FaRegSave className="text-gray-500 text-lg" />
            )}
          </button>
          <button
            onClick={handleLikeClick}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
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

      {/* Property Details */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
            {property.title}
          </h3>
          {currentUserProfile && currentUserProfile.id === property.userId && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/route/post/edit/${property.id}`)}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <FaEdit /> แก้ไขประกาศ
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 hover:text-red-600 flex items-center gap-1"
                disabled={isDeleting}
              >
                <FaTrash /> ลบประกาศ
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="mr-1 text-blue-500" />
          <p className="text-sm line-clamp-1">
            {property.address}, {property.city}
          </p>
        </div>

        <p className="text-gray-600 text-sm mb-3 whitespace-pre-line">
          {property.description}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleComments}
                className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
              >
                <FaComment className="mr-1" />
                <span className="text-sm text-gray-500">
                  {property.comments?.length || 0}
                </span>
              </button>
              <span className="mx-1">•</span>
              <FaHeart className="text-gray-400" />
              <span className="text-sm text-gray-500">{likeCount}</span>
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
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center">
              <FaBath className="mr-1" />
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center">
              <FaRuler className="mr-1" />
              <span className="text-sm">{property.square_feet} m²</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {property.phone && (
          <button
            onClick={() => {
              if (property.phone) {
                navigator.clipboard.writeText(property.phone);
                toast.success("คัดลอกเบอร์โทรศัพท์แล้ว");
              }
            }}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>โทรศัพท์</span>
          </button>
        )}

        {property.line_id && (
          <button
            onClick={() =>
              window.open(`https://line.me/ti/p/${property.line_id}`, "_blank")
            }
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.365 9.863c.349 0 .63.285.631.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            <span>Line</span>
          </button>
        )}

        {property.google_map_link && (
          <button
            onClick={() => window.open(property.google_map_link, "_blank")}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Google Map</span>
          </button>
        )}

        {/* เพิ่มปุ่มแสดงเอกสาร */}
        {property.documents && property.documents.length > 0 && (
          <button
            onClick={() => setShowDocumentsModal(true)}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FaFileContract className="text-xl" />
            <span>เอกสารประกอบ</span>
          </button>
        )}

        {/* ปุ่มสร้างสัญญาซื้อขาย */}
        <button
          onClick={() =>
            router.push(
              `/route/properties/gentradingdoc?propertyId=${property.id}&userId=${currentUserProfile?.id}`
            )
          }
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FaFileContract className="text-xl" />
          <span>สร้างสัญญาซื้อขาย</span>
        </button>
      </div>
      {/* Property Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center">
          {propertyOwner?.avatar ? (
            <Image
              src={propertyOwner.avatar}
              alt={`${propertyOwner.firstName} ${propertyOwner.lastName}`}
              width={24}
              height={24}
              className="rounded-full mr-2"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <span className="text-xs text-blue-500 font-bold">
                {propertyOwner?.firstName?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-600">
            Posted by {propertyOwner?.firstName} {propertyOwner?.lastName}
          </span>

          {/* แสดงวันที่สร้าง */}
          <FaClock className="flex items-left text-gray-500 text-xs mx-5 mt-3 mb-3 mr-1" />
          <span className="flex items-left text-gray-500 text-xs mt-3 mb-3">
            {formatDate(property.createdAt)}
          </span>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100">
          <Comments
            propertyId={property.id}
            initialComments={property.comments || []}
          />
        </div>
      )}

      {/* Modal ยืนยันการลบ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">ยืนยันการลบประกาศ</h3>
            <p className="mb-6">
              คุณแน่ใจหรือไม่ที่จะลบประกาศนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={isDeleting}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteProperty}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    กำลังลบ...
                  </>
                ) : (
                  <>
                    <FaTrash /> ยืนยันการลบ
                  </>
                )}
              </button>
            </div>
          </div>
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
              {property.documents?.map((doc, index) => (
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
