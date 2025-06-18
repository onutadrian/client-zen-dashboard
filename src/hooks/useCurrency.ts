
import { useState, useEffect } from 'react';

export const useCurrency = () => {
  const [displayCurrency, setDisplayCurrency] = useState(() => {
    // Load currency from localStorage or default to USD
    return localStorage.getItem('displayCurrency') || 'USD';
  });

  const updateCurrency = (currency: string) => {
    setDisplayCurrency(currency);
    localStorage.setItem('displayCurrency', currency);
  };

  return {
    displayCurrency,
    updateCurrency
  };
};
