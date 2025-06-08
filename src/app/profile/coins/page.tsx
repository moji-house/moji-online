'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ICoinBalanceContext, useCoinBalance } from '@/context/CoinBalanceContext';
import { ICoinTransactionsContext, useCoinTransactions } from '@/context/CoinTransactionsContext';
import Link from 'next/link';

export default function CoinHistoryPage() {
  const { data: session, status } = useSession();
  const { coinBalance } = useCoinBalance() as ICoinBalanceContext;
  const { transactions, isLoading, error } = useCoinTransactions() as ICoinTransactionsContext;

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view your coin transaction history.
          </p>
          <Link
            href="/api/auth/signin"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Coin Transaction History</h1>

      {/* Coin Balance Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Current Balance</h2>
            <p className="text-sm text-gray-500 mt-1">
              Use your coins for premium features and promotions
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-yellow-50 px-6 py-3 rounded-lg">
              <span className="text-3xl font-bold text-yellow-600">
                {coinBalance.toFixed(2)}
              </span>
              <span className="ml-2 text-yellow-600">Coins</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-700 mb-1">Earned</h3>
            <p className="text-xl font-semibold text-green-600">
              +{transactions
                .filter(tx => tx.amount > 0)
                .reduce((sum, tx) => sum + tx.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-700 mb-1">Spent</h3>
            <p className="text-xl font-semibold text-red-600">
              {transactions
                .filter(tx => tx.amount < 0)
                .reduce((sum, tx) => sum + tx.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-700 mb-1">Transactions</h3>
            <p className="text-xl font-semibold text-blue-600">
              {transactions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
        </div>

        {error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-500">
              Start listing properties to earn coins!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.propertyId ? (
                        <Link
                          href={`/properties/${transaction.propertyId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {transaction.propertyTitle}
                        </Link>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* How to Earn More Coins */}
      <div className="bg-white rounded-lg shadow-md mt-8 p-6">
        <h2 className="text-xl font-semibold mb-4">How to Earn More Coins</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-medium">Refer Friends</h3>
            </div>
            <p className="text-sm text-gray-600">
              Get 10 coins for each friend you refer who signs up and lists a property.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-md">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-medium">Write Reviews</h3>
            </div>
            <p className="text-sm text-gray-600">
              Earn 5 coins for each detailed review you write for properties you've visited.
            </p>
          </div>
        </div>
      </div>

      {/* Ways to Use Coins */}
      <div className="bg-white rounded-lg shadow-md mt-8 p-6">
        <h2 className="text-xl font-semibold mb-4">Ways to Use Your Coins</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Premium Listing</h3>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                15 Coins
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Highlight your property with a premium listing that appears at the top of search results.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Upgrade a Listing →
            </button>
          </div>

          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Featured Property</h3>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                30 Coins
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Get your property featured on the homepage for maximum visibility.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Feature a Property →
            </button>
          </div>

          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Virtual Tour</h3>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                25 Coins
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Add a virtual tour option to your property listing for an immersive experience.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Add Virtual Tour →
            </button>
          </div>

          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Professional Photos</h3>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                40 Coins
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Get professional photography for your property to attract more buyers.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Book a Photographer →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}