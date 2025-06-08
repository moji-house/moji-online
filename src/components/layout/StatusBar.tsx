"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlus, FaSignOutAlt, FaUser, FaHome } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import LoginButton from "@/components/auth/LoginButton";
import { ICoinBalanceContext, useCoinBalance } from "@/context/CoinBalanceContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { UserInfoSession, UserSession } from "@/app/types/auth";

export default function StatusBar() {
  const { data: session, status } = useSession();
  const typedSession = session as UserSession;
  const { coinBalance, loading } = useCoinBalance() as ICoinBalanceContext;
  const { userProfiles } = useUserProfile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // หาข้อมูลโปรไฟล์ของผู้ใช้ปัจจุบัน
  const currentUserProfile = userProfiles.find(
    (profile) => profile.email === typedSession?.user?.email
  );

  // ฟังก์ชันสำหรับแสดงสถานะของผู้ใช้
  const getUserRole = (user: UserInfoSession) => {
    if (currentUserProfile?.role) {
      return currentUserProfile.role;
    }
    return user?.role || "Visitor";
  };

  // ถ้าไม่มี session หรือกำลังโหลด ให้แสดงปุ่ม Sign In with Google
  if (status !== "authenticated" || !typedSession) {
    return (
      <main className="container mx-auto px-4 py-2">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <div className="bg-white border-b border-gray-200 py-2">
              <div className="container mx-auto px-0 flex justify-end">
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ถ้ามี session (ล็อกอินแล้ว) ให้แสดงข้อมูลผู้ใช้และปุ่ม Create Post
  return (
    <main className="container mx-auto px-4 py-2">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          <div className="bg-white border-b border-gray-200 py-2">
            <div className="container mx-auto px-0 flex justify-between items-center">
              {/* ข้อมูลผู้ใช้ (ด้านซ้าย) */}
              <div className="relative">
                <div
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {currentUserProfile?.avatar ? (
                    <Image
                      src={currentUserProfile.avatar}
                      alt={`${currentUserProfile.firstName} ${currentUserProfile.lastName}`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : typedSession.user?.image ? (
                    <Image
                      src={typedSession.user.image}
                      alt={typedSession.user.name || "User"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-500 font-bold">
                        {currentUserProfile
                          ? currentUserProfile.firstName.charAt(0)
                          : typedSession.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700">
                      {currentUserProfile
                        ? `${currentUserProfile.firstName} ${currentUserProfile.lastName}`
                        : typedSession.user?.name || "User"}
                    </span>
                    <span className="text-xs text-blue-600 font-medium block ml-2">
                      {getUserRole(typedSession.user)}
                    </span>
                    <Link href="/route/coins">
                      {!loading && (
                        <span className="text-xs text-yellow-600 font-medium block ml-2">
                          {coinBalance.toFixed(2)} Coins
                        </span>
                      )}
                    </Link>
                  </div>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      href="/route/profile/myprofile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <FaUser className="mr-2" />
                        Profile
                      </div>
                    </Link>
                    <Link
                      href="/route/properties/myproperties"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <FaHome className="mr-2" />
                        My Properties
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        Sign Out
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* ปุ่ม Create Post (ย้ายมาด้านขวา) */}
              <Link
                href="/route/properties/createpost"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Create Post
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
