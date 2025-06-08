'use client';

import { ICoinBalanceContext, useCoinBalance } from '../../context/CoinBalanceContext';
import Link from 'next/link';

export default function CoinBalanceWidget() {
  const { coinBalance, loading } = useCoinBalance() as ICoinBalanceContext;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Coin Balance</h2>
        <Link href="/profile/coins" className="text-blue-600 text-sm hover:underline">
          View History
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-yellow-50 py-6 px-4 rounded-lg mb-4">
            <span className="text-4xl font-bold text-yellow-600">
              {coinBalance.toFixed(2)}
            </span>
            <span className="ml-2 text-yellow-600">Coins</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link 
              href="/route/properties/createpost" 
              className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700"
            >
              List Property
            </Link>
            <Link 
              href="/profile/coins" 
              className="bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-sm hover:bg-gray-200"
            >
              Use Coins
            </Link>
          </div>
          
          <p className="text-xs text-gray-500">
            Earn coins by listing properties and referring friends
          </p>
        </div>
      )}
    </div>
  );
}
