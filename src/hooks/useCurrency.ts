import { useState, useEffect, useCallback } from 'react';

export const useCurrency = () => {
  const [displayCurrency, setDisplayCurrency] = useState(() => {
    // Load currency from localStorage or default to USD
    return localStorage.getItem('displayCurrency') || 'USD';
  });

  // Listen for currency changes from other components
  useEffect(() => {
    const handleCurrencyChange = (event: CustomEvent) => {
      setDisplayCurrency(event.detail.currency);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, []);

  const updateCurrency = useCallback((currency: string) => {
    console.log('Currency updated to:', currency);
    setDisplayCurrency(currency);
    localStorage.setItem('displayCurrency', currency);
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('currencyChanged', { 
      detail: { currency } 
    }));
  }, []);

  return {
    displayCurrency,
    updateCurrency
  };
};