"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useRoleCheck() {
  const { data: session, status } = useSession();
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        setHasRole(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch user profile to check roles
        const response = await fetch(`/api/profiles?email=${encodeURIComponent(session?.user?.email || '')}`);
        const data = await response.json();
        
        if (data.profiles && data.profiles[0]?.roles?.length > 0) {
          setHasRole(true);
        } else {
          setHasRole(false);
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        setHasRole(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [session, status]);

  const assignRole = async (role: string) => {
    try {
      const response = await fetch('/api/profiles/assign-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      
      if (response.ok) {
        setHasRole(true);
        setIsModalOpen(false);
      } else {
        throw new Error('Failed to assign role');
      }
    } catch (error) {
      console.error("Error assigning role:", error);
      throw error;
    }
  };

  return {
    hasRole,
    isLoading,
    isModalOpen,
    assignRole
  };
}