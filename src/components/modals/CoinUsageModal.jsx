'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCoinBalance } from '../../context/CoinBalanceContext';

export default function CoinUsageModal({ 
  isOpen, 
  onClose, 
  featureTitle, 
  featureDescription, 
  coinCost, 
  onConfirm,
  propertyId 
}) {
  const { data: session } = useSession();
  const { coinBalance, updateCoinBalance } = useCoinBalance();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  if (!isOpen) return null;
  
  const handlePurchase = async () => {
    if (!session?.user?.id) {
      setError('You must be signed in to use this feature');
      return;
    }
    
    if (coinBalance < coinCost) {
      setError('You don\'t have enough coins for this feature');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError('');
      
      // Create a coin transaction for the purchase
      const response = await fetch('/api/users/coins/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          amount: -coinCost, // Negative amount for purchases
          type: 'purchase',
          description: `Purchase: ${featureTitle}`,
          propertyId
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process purchase');
      }
      
      // Update coin balance in context
      await updateCoinBalance();
      
      // Call the onConfirm callback
      if (onConfirm) {
        await onConfirm();
      }
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error processing purchase:', error);
      setError(error.message || 'Failed to process purchase');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {featureTitle}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            {featureDescription}
          </p>
          
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Cost</p>
                <p className="text-xl font-bold text-yellow-600">
                  {coinCost.toFixed(2)} Coins
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Your Balance</p>
                <p className={`text-xl font-bold ${coinBalance >= coinCost ? 'text-green-600' : 'text-red-600'}`}>
                  {coinBalance.toFixed(2)} Coins
                </p>
              </div>
            </div>
            
            {coinBalance < coinCost && (
              <div className="mt-3 text-sm text-red-600">
                You don't have enough coins for this feature.
              </div>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            
            <button
              onClick={handlePurchase}
              disabled={isProcessing || coinBalance < coinCost}
              className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Confirm Purchase'}
            </button>
          </div>
          
          {coinBalance < coinCost && (
            <div className="mt-4 text-center">
              <a 
                href="/profile/coins" 
                className="text-blue-600 text-sm hover:underline"
              >
                Learn how to earn more coins
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
