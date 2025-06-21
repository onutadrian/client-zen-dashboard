
import { useState, useEffect } from 'react';

export const useCurrency = () => {
  const [displayCurrency, setDisplayCurrency] = useState(() => {
    // Load currency from localStorage or default to USD
    return localStorage.getItem('displayCurrency') || 'USD';
  });

  const updateCurrency = (currency: string) => {
    console.log('Currency updated to:', currency);
    setDisplayCurrency(currency);
    localStorage.setItem('displayCurrency', currency);
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('currencyChanged', { 
      detail: { currency } 
    }));
  };

  return {
    displayCurrency,
    updateCurrency
  };
};
