"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import Logo from "@/assets/Moji-Logo.png";
import { ICoinBalanceContext, useCoinBalance } from "@/context/CoinBalanceContext";
import { useUserProfile } from "@/context/UserProfileContext";
import UserMenu from "@/components/auth/UserMenu";

export default function Header() {
  const { data: session, status } = useSession();
  const { coinBalance, loading } = useCoinBalance() as ICoinBalanceContext;
  const { userProfiles } = useUserProfile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Find the current user's profile
  const currentUserProfile = userProfiles?.find(
    (profile) => profile.email === session?.user?.email
  ) || session?.user;

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Home">
          <Image
            src={Logo}
            alt="Moji House Logo"
            width={80}
            height={40}
            className="object-contain"
          />
          <span className="text-2xl font-bold bg-[#5a86c3] bg-clip-text text-transparent">
            Moji House
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search properties"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/route/properties/createpost" className="text-gray-700 hover:text-blue-600">
            Create Post
          </Link>
          <Link href="/route/properties/searchproperties" className="text-gray-700 hover:text-blue-600">
            Search Properties
          </Link>
          <Link href="/route/profile/userprofiles" className="text-gray-700 hover:text-blue-600">
            Friends
          </Link>
          <Link href="/route/whitepaper" className="text-gray-700 hover:text-blue-600">
            Whitepaper
          </Link>

          {/* User Menu */}
          {session ? (
            <div className="flex flex-col items-center">
              <UserMenu user={currentUserProfile} />
              <Link
                href="/route/coins"
                className="text-xs text-yellow-600 font-medium mt-1"
              >
                {!loading ? `${coinBalance?.toFixed(2) || 0} Coins` : "Loading..."}
              </Link>
            </div>
          ) : (
            <Link
              href="/route/login/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Search properties"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
            <nav className="flex flex-col space-y-3">
              <Link href="/route/properties/createpost" className="text-gray-700 hover:text-blue-600">
                Create Post
              </Link>
              <Link href="/route/properties/searchproperties" className="text-gray-700 hover:text-blue-600">
                Search Properties
              </Link>
              <Link href="/route/profile/userprofiles" className="text-gray-700 hover:text-blue-600">
                Friends
              </Link>
              <Link href="/route/whitepaper" className="text-gray-700 hover:text-blue-600">
                Whitepaper
              </Link>
              {session ? (
                <div className="flex flex-col items-center py-2">
                  <UserMenu user={currentUserProfile} />
                  <Link
                    href="/route/coins"
                    className="text-xs text-yellow-600 font-medium mt-1"
                  >
                    {!loading ? `${coinBalance?.toFixed(2) || 0} Coins` : "Loading..."}
                  </Link>
                </div>
              ) : (
                <Link
                  href="/route/login/"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}