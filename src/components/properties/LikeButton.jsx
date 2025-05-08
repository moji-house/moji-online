"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function LikeButton({ propertyId }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  // Check if the user has already liked this property
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await axios.get(`/api/properties/${propertyId}/like`);
        setIsLiked(response.data.isLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkIfLiked();
  }, [propertyId, session?.user?.id]);

  const toggleLike = async () => {
    if (!session) {
      toast.error("Please login to like properties");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`/api/properties/${propertyId}/like`, {
        userId: session.user.id
      });

      setIsLiked(response.data.isLiked);
      
      if (response.data.isLiked) {
        toast.success("Property added to favorites");
      } else {
        toast.success("Property removed from favorites");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update favorite status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
    >
      {isLiked ? (
        <FaHeart className="text-red-500 text-xl" />
      ) : (
        <FaRegHeart className="text-gray-500 hover:text-red-500 text-xl" />
      )}
    </button>
  );
}
