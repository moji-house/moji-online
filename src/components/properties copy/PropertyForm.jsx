'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCoinBalance } from '../../context/CoinBalanceContext';

export default function PropertyForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const { updateCoinBalance } = useCoinBalance();
  const [formData, setFormData] = useState({
    // Your form fields
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showRewardNotification, setShowRewardNotification] = useState(false);
  const [coinReward, setCoinReward] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!session) {
      setError('You must be signed in to create a property listing');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const propertyData = {
        ...formData,
        userId: session.user.id
      };
      
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create property');
      }
      
      // Calculate coin reward (same calculation as in the API)
      const reward = formData.price * 0.000001;
      setCoinReward(reward);
      
      // Update coin balance in context
      await updateCoinBalance();
      
      // Show reward notification
      setShowRewardNotification(true);
      
      // Redirect after a delay to show the notification
      setTimeout(() => {
        router.push(`/properties/${data.id}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error creating property:', error);
      setError(error.message || 'Failed to create property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        {/* Your form fields */}
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Property Listing'}
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </form>
      
      {/* Coin Reward Notification */}
      {showRewardNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="text-center">
              <div className="inline-block p-3 bg-yellow-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v2m0 8v2m-6-6h2m8 0h2" />
                                </svg>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">Congratulations!</h3>
                              <p className="text-gray-600 mb-4">
                                Your property has been successfully listed. You've earned:
                              </p>
                              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                                <span className="text-2xl font-bold text-yellow-600">
                                  {coinReward.toFixed(2)} Coins
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mb-4">
                                Coins have been added to your balance and can be used for premium features.
                              </p>
                              <button
                                onClick={() => {
                                  setShowRewardNotification(false)
                                  router.push(`/properties/${data.id}`)
                                }}
                                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                View Your Property
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
}