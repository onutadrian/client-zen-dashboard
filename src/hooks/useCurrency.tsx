
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
      
      // Check if we have a cached version less than 24 hours old
      const cachedRates = localStorage.getItem('exchangeRates');
      const cachedTimestamp = localStorage.getItem('exchangeRatesTimestamp');
      
      if (cachedRates && cachedTimestamp) {
        const timestamp = new Date(cachedTimestamp);
        const now = new Date();
        const hoursSinceLastFetch = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastFetch < 24) {
          console.log('Using cached exchange rates from', timestamp);
          setLiveExchangeRates(JSON.parse(cachedRates));
          setLastFetched(timestamp);
          setLoadingRates(false);
          return;
        }
      }
      
      // Try to fetch new rates from our edge function
      console.log('Attempting to fetch fresh exchange rates from edge function...');
      
      try {
        const { data, error } = await supabase.functions.invoke('fetch-exchange-rates');
        
        if (error) {
          console.warn('Edge function error:', error);
          throw new Error(`Edge function error: ${error.message}`);
        }
        
        if (!data || !data.success) {
          console.warn('Edge function returned error or no data:', data);
          throw new Error(`API error: ${data?.error || 'No data received'}`);
        }
        
        console.log('Successfully fetched live exchange rates:', data.rates);
        
        // Cache the rates
        localStorage.setItem('exchangeRates', JSON.stringify(data.rates));
        localStorage.setItem('exchangeRatesTimestamp', new Date().toISOString());
        
        setLiveExchangeRates(data.rates);
        setLastFetched(new Date());
        
      } catch (edgeFunctionError) {
        console.warn('Edge function failed, falling back to static rates:', edgeFunctionError);
        // Fall back to static rates when edge function fails
        setLiveExchangeRates(fallbackExchangeRates);
        // Don't cache fallback rates
      }
      
    } catch (error) {
      console.error('Error in fetchExchangeRates:', error);
      // Final fallback to static rates
      console.log('Using fallback exchange rates due to error');
      setLiveExchangeRates(fallbackExchangeRates);
    } finally {
      setLoadingRates(false);
    }
  }, []);

  // Fetch exchange rates on mount
  useEffect(() => {
    fetchExchangeRates();
    
    // Refresh rates every 24 hours
    const interval = setInterval(fetchExchangeRates, 24 * 60 * 60 * 1000);
    
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
