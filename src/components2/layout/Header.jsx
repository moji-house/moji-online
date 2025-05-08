'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useCoinBalance } from '../../context/CoinBalanceContext';

export default function Header() {
  const { data: session } = useSession();
  const { coinBalance, loading } = useCoinBalance();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="MojiHouse" width={40} height={40} />
            <span className="ml-2 text-xl font-bold text-blue-600">MojiHouse</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/properties" className="text-gray-700 hover:text-blue-600">Properties</Link>
            <Link href="/agents" className="text-gray-700 hover:text-blue-600">Agents</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
          </nav>
          
          {/* User Menu */}
          <div className="relative">
            {session ? (
              <div className="flex items-center">
                <button 
                  onClick={toggleMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-gray-800">{session.user.name}</span>
                    {!loading && (
                      <span className="text-xs text-yellow-600 font-medium">
                        {coinBalance.toFixed(2)} Coins
                      </span>
                    )}
                  </div>
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <Image 
                      src={session.user.image || "https://randomuser.me/api/portraits/men/1.jpg"} 
                      alt={session.user.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/my-properties" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Properties
                    </Link>
                    <Link href="/saved" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Saved Properties
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/api/auth/signin"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
