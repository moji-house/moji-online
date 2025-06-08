"use client";

import { signIn } from "next-auth/react";
import { FaFacebook } from "react-icons/fa";

export default function LoginFButton() {
  return (
    <button
      onClick={() => signIn("facebook")}
      className="flex items-center space-x-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-full transition shadow-sm"
    >
      <FaFacebook className="text-blue-600" />
      <span>เข้าสู่ระบบด้วย Facebook</span>
    </button>
  );
} 