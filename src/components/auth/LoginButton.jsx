"use client";

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center space-x-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-full transition shadow-sm"
    >
      <FaGoogle className="text-red-500" />
      <span>เข้าสู่ระบบด้วย Google</span>
    </button>
  );
}
