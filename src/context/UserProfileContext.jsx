"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
  const { data: session } = useSession();
  const [userProfiles, setUserProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users/profiles");
      if (!response.ok) {
        throw new Error("Failed to fetch user profiles");
      }
      const data = await response.json();
      setUserProfiles(data);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // ฟังก์ชันสำหรับอัพเดทข้อมูลโปรไฟล์
  const updateProfile = async (userId, updatedData) => {
    try {
      const response = await fetch(`/api/users/profiles/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();
      setUserProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === userId ? updatedProfile : profile
        )
      );

      return updatedProfile;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // ฟังก์ชันสำหรับการโหวต
  const handleVote = async (userId, voteValue) => {
    if (!session) {
      throw new Error("Please sign in to vote");
    }

    try {
      const response = await fetch(`/api/users/profiles/${userId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voteValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to vote");
      }

      const updatedProfile = await response.json();
      setUserProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === userId ? updatedProfile : profile
        )
      );

      return updatedProfile;
    } catch (error) {
      console.error("Error voting for user:", error);
      throw error;
    }
  };

  // ฟังก์ชันสำหรับการติดตาม
  const handleFollow = async (userId) => {
    if (!session) {
      throw new Error("Please sign in to follow users");
    }

    try {
      const response = await fetch(`/api/users/profiles/${userId}/follow`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to follow user");
      }

      const updatedProfile = await response.json();
      setUserProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === userId ? updatedProfile : profile
        )
      );

      return updatedProfile;
    } catch (error) {
      console.error("Error following user:", error);
      throw error;
    }
  };

  const value = {
    userProfiles,
    isLoading,
    error,
    fetchProfiles,
    updateProfile,
    handleVote,
    handleFollow,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}
