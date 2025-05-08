"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaSignOutAlt, FaClipboardList } from "react-icons/fa";

export default function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
          {user && user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.firstName || "User"}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
              <FaUser className="text-blue-500" />
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="font-medium text-gray-800">
              {user.firstName + " " + user.lastName}
            </p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>

          <Link
            href="/route/profile/myprofile"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FaUser className="mr-2" />
            My Profile
          </Link>

          <Link
            href="/route/properties/myproperties"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FaClipboardList className="mr-2" />
            My Properties Post
          </Link>

          
          <Link
            href="/route/properties/mysaved"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FaClipboardList className="mr-2" />
            My Properties Saved
          </Link>

          <button
            onClick={() => signOut()}
            className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaSignOutAlt className="mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
