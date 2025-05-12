"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface RoleSelectionModalProps {
  onRoleSelected: (role: string) => Promise<void>;
  isOpen: boolean;
}

const RoleSelectionModal = ({ onRoleSelected, isOpen }: RoleSelectionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen) return null;
  
  const handleRoleSelection = async (role: string) => {
    setIsSubmitting(true);
    try {
      await onRoleSelected(role);
    } catch (error) {
      console.error("Error selecting role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Select Your Role</h2>
        <p className="mb-6">
          Please select a role to continue. This will determine your experience and permissions within the application.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelection('Owner')}
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Property Owner
          </button>
          
          <button
            onClick={() => handleRoleSelection('Agent')}
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Real Estate Agent
          </button>
          
          <button
            onClick={() => handleRoleSelection('Customer')}
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Customer
          </button>
        </div>
        
        {isSubmitting && (
          <div className="mt-4 text-center text-gray-600">
            Saving your selection...
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelectionModal;