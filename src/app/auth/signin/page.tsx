"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn("google")}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </span>
            เข้าสู่ระบบด้วย Google
          </button>
        </div>
      </div>
    </div>
  );
} 