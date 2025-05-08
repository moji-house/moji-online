"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaRegStar, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function PointDisplay({ propertyId, initialPoints = 0 }) {
  const [points, setPoints] = useState(initialPoints);
  const [isVoting, setIsVoting] = useState(false);
  const [userVoted, setUserVoted] = useState(false);
  const { data: session } = useSession();

  // ตรวจสอบสถานะการโหวตเมื่อ component โหลด
  useEffect(() => {
    const checkUserVote = async () => {
      if (session?.user?.id) {
        try {
          const response = await axios.get(`/api/properties/${propertyId}/vote/check`, {
            params: { userId: session.user.id }
          });
          setUserVoted(response.data.hasVoted);
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการตรวจสอบการโหวต:", error);
        }
      }
    };

    checkUserVote();
  }, [propertyId, session?.user?.id]);

  const handleVote = async (voteType) => {
    if (!session) {
      toast.error("กรุณาเข้าสู่ระบบเพื่อโหวต");
      return;
    }

    if (userVoted) {
      toast.error("คุณได้โหวตไปแล้ว");
      return;
    }

    setIsVoting(true);

    try {
      const response = await axios.post(`/api/properties/${propertyId}/vote`, {
        voteType,
        userId: session.user.id
      });

      if (response.data.success) {
        setPoints(response.data.points);
        setUserVoted(true);
        toast.success(`โหวต${voteType === 'up' ? 'เพิ่ม' : 'ลด'}สำเร็จ!`);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหวต:", error);
      toast.error(error.response?.data?.error || "ไม่สามารถโหวตได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsVoting(false);
    }
  };

  // Render stars based on points (1 star per 20 points)
  const renderStars = () => {
    const totalStars = 5;
    const filledStars = Math.min(Math.floor(points / 20), totalStars);
    
    return (
      <div className="flex">
        {[...Array(totalStars)].map((_, index) => (
          index < filledStars ? (
            <FaStar key={index} className="text-yellow-400" />
          ) : (
            <FaRegStar key={index} className="text-gray-300" />
          )
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
      {/* Vote Up Button */}
      <button
        onClick={() => handleVote('up')}
        disabled={isVoting || userVoted}
        className={`p-1 rounded-full ${
          userVoted ? 'bg-gray-200 cursor-not-allowed' : 'bg-green-100 hover:bg-green-200'
        } transition-colors`}
        aria-label="โหวตเพิ่ม"
      >
        <FaChevronUp className={`${userVoted ? 'text-gray-400' : 'text-green-600'}`} />
      </button>
      
      {/* Points Display */}
      <div className="flex flex-col items-center">
        <div className="text-lg font-bold">{points}</div>
        {renderStars()}
      </div>
      
      {/* Vote Down Button */}
      <button
        onClick={() => handleVote('down')}
        disabled={isVoting || userVoted}
        className={`p-1 rounded-full ${
          userVoted ? 'bg-gray-200 cursor-not-allowed' : 'bg-red-100 hover:bg-red-200'
        } transition-colors`}
        aria-label="โหวตลด"
      >
        <FaChevronDown className={`${userVoted ? 'text-gray-400' : 'text-red-600'}`} />
      </button>
    </div>
  );
}
