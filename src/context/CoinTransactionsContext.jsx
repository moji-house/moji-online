'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CoinTransactionsContext = createContext();

export function CoinTransactionsProvider({ children }) {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    if (!session?.user?.email) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/coins/transaction');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [session]);

  return (
    <CoinTransactionsContext.Provider value={{ 
      transactions, 
      isLoading, 
      error,
      refreshTransactions: fetchTransactions 
    }}>
      {children}
    </CoinTransactionsContext.Provider>
  );
}

export function useCoinTransactions() {
  const context = useContext(CoinTransactionsContext);
  if (context === undefined) {
    throw new Error('useCoinTransactions must be used within a CoinTransactionsProvider');
  }
  return context;
} 