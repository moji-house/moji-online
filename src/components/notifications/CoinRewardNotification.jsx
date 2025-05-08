'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CoinRewardNotification({ 
  show, 
  onClose, 
  coinAmount, 
  propertyId,
  autoCloseTime = 5000 
}) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(show);
  
  useEffect(() => {
    setIsVisible(show);
    
    if (show && autoCloseTime > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [show, autoCloseTime, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden z-50 animate-slide-up">
      <div className="bg-yellow-50 px-4 py-2 border-b border-yellow-100">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v2m0 8v2m-6-6h2m8 0h2" />
          </svg>
          <h3 className="font-medium text-yellow-800">Coin Reward</h3>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 mb-3">
          Congratulations! You've earned coins for your property listing.
        </p>
        
        <div className="bg-yellow-50 p-3 rounded-md text-center mb-3">
          <span className="text-2xl font-bold text-yellow-600">
            +{coinAmount.toFixed(2)}
          </span>
          <span className="ml-1 text-yellow-600">Coins</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setIsVisible(false)
              if (onClose) onClose()
            }}
            className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200"
          >
            Dismiss
          </button>
          
          {propertyId && (
            <button
              onClick={() => {
                setIsVisible(false)
                if (onClose) onClose()
                router.push(`/properties/${propertyId}`)
              }}
              className="flex-1 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              View Property
            </button>
          )}
        </div>
      </div>
    </div>
  )
}