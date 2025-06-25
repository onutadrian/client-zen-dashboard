
import React, { createContext, useContext, useState } from 'react';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  displayCurrency: string;
  formatCurrency: (amount: number, currency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  const formatCurrency = (amount: number, curr?: string) => {
    const useCurrency = curr || currency;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: useCurrency,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      displayCurrency: currency,
      formatCurrency,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
