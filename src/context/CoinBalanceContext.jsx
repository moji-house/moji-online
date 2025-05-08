'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useUserProfile } from "@/context/UserProfileContext";

// Crear el contexto
const CoinBalanceContext = createContext();

// Proveedor del contexto
export function CoinBalanceProvider({ children }) {
  const { data: session } = useSession();
  const { userProfiles } = useUserProfile();
  const [loading, setLoading] = useState(true);
  const [coinBalance, setCoinBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // Memoize user profile เพื่อลดการคำนวณซ้ำ
  const currentUserProfile = useMemo(() => {
    if (!session?.user?.email || !userProfiles) return null;
    return userProfiles.find(profile => profile.email === session.user.email);
  }, [session?.user?.email, userProfiles]);

// console.log('currentUserProfile', currentUserProfile)

  // ดึงข้อมูลเหรียญและประวัติการทำรายการจาก API
  useEffect(() => {
    const fetchCoinData = async () => {
      if (!currentUserProfile) {
        setCoinBalance(0);
        setTransactions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/coins', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'ไม่สามารถดึงข้อมูลเหรียญได้');
        }

        const data = await response.json();
        // console.log('Coin data:', data); // เพิ่ม log เพื่อดูข้อมูลที่ได้รับ
        setCoinBalance(data.balance);
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error('Error fetching coin data:', error);
        setCoinBalance(0);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [currentUserProfile]);

  // Memoize context value เพื่อป้องกันการ re-render ที่ไม่จำเป็น
  const contextValue = useMemo(() => ({
    coinBalance,
    loading,
    transactions,
    setCoinBalance
  }), [coinBalance, loading, transactions]);

  return (
    <CoinBalanceContext.Provider value={contextValue}>
      {children}
    </CoinBalanceContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useCoinBalance() {
  const context = useContext(CoinBalanceContext);
  if (context === undefined) {
    throw new Error('useCoinBalance must be used within a CoinBalanceProvider');
  }
  return context;
}
