
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fallbackExchangeRates, convertCurrency as convertCurrencyUtil } from '@/lib/currency';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  displayCurrency: string;
  formatCurrency: (amount: number, currency?: string) => string;
  convert: (amount: number, fromCurrency: string, toCurrency: string) => number;
  updateCurrency: (currency: string) => void;
  loadingRates: boolean;
  lastFetched: Date | null;
  refreshRates: () => Promise<void>;
}

interface ExchangeRates {
  [currency: string]: {
    [currency: string]: number;
  };
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [displayCurrency, setDisplayCurrency] = useState(() => {
    // Load currency from localStorage or default to USD
    return localStorage.getItem('displayCurrency') || 'USD';
  });
  
  const [liveExchangeRates, setLiveExchangeRates] = useState<ExchangeRates | null>(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // Fetch exchange rates from our edge function
  const fetchExchangeRates = useCallback(async () => {
    try {
      setLoadingRates(true);
      
      // Check if we have a cached version less than 1 hour old
      const cachedRates = localStorage.getItem('exchangeRates');
      const cachedTimestamp = localStorage.getItem('exchangeRatesTimestamp');
      
      if (cachedRates && cachedTimestamp) {
        const timestamp = new Date(cachedTimestamp);
        const now = new Date();
        const hoursSinceLastFetch = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastFetch < 1) {
          console.log('Using cached exchange rates from', timestamp);
          setLiveExchangeRates(JSON.parse(cachedRates));
          setLastFetched(timestamp);
          setLoadingRates(false);
          return;
        }
      }
      
      // Fetch new rates from our edge function
      console.log('Fetching fresh exchange rates from edge function...');
      const { data, error } = await supabase.functions.invoke('fetch-exchange-rates');
      
      if (error) {
        console.error('Error calling edge function:', error);
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data.success) {
        console.error('Edge function returned error:', data.error);
        throw new Error(`API error: ${data.error}`);
      }
      
      console.log('Fetched live exchange rates:', data.rates);
      
      // Cache the rates
      localStorage.setItem('exchangeRates', JSON.stringify(data.rates));
      localStorage.setItem('exchangeRatesTimestamp', new Date().toISOString());
      
      setLiveExchangeRates(data.rates);
      setLastFetched(new Date());
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Fall back to static rates
      console.log('Using fallback exchange rates');
      setLiveExchangeRates(fallbackExchangeRates);
    } finally {
      setLoadingRates(false);
    }
  }, []);

  // Fetch exchange rates on mount
  useEffect(() => {
    fetchExchangeRates();
    
    // Refresh rates every hour
    const interval = setInterval(fetchExchangeRates, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchExchangeRates]);

  // Listen for currency changes from other components
  useEffect(() => {
    const handleCurrencyChange = (event: CustomEvent) => {
      setDisplayCurrency(event.detail.currency);
      setCurrency(event.detail.currency);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, []);

  const updateCurrency = useCallback((newCurrency: string) => {
    console.log('Currency updated to:', newCurrency);
    setDisplayCurrency(newCurrency);
    setCurrency(newCurrency);
    localStorage.setItem('displayCurrency', newCurrency);
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('currencyChanged', { 
      detail: { currency: newCurrency } 
    }));
  }, []);

  // Provide a convert function that uses the live rates
  const convert = useCallback((amount: number, fromCurrency: string, toCurrency: string): number => {
    return convertCurrencyUtil(amount, fromCurrency, toCurrency, liveExchangeRates || fallbackExchangeRates);
  }, [liveExchangeRates]);

  const formatCurrency = (amount: number, curr?: string) => {
    const useCurrency = curr || displayCurrency;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: useCurrency,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      displayCurrency,
      formatCurrency,
      convert,
      updateCurrency,
      loadingRates,
      lastFetched,
      refreshRates: fetchExchangeRates,
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
