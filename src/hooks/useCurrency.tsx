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
  demoMode: boolean;
  toggleDemoMode: () => void;
}

interface ExchangeRates {
  [currency: string]: {
    [currency: string]: number;
  };
}

const BNR_REFRESH_HOUR = 13;
const BNR_REFRESH_MINUTE = 30;

const getBucharestParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Bucharest',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date);

  const value = (type: string) => parts.find(part => part.type === type)?.value ?? '';

  return {
    dateKey: `${value('year')}-${value('month')}-${value('day')}`,
    minutesSinceMidnight: Number(value('hour')) * 60 + Number(value('minute'))
  };
};

const isAfterBnrRefreshWindow = (date: Date) => {
  const { minutesSinceMidnight } = getBucharestParts(date);
  return minutesSinceMidnight >= (BNR_REFRESH_HOUR * 60) + BNR_REFRESH_MINUTE;
};

const shouldUseCachedExchangeRates = (cachedTimestamp: string | null) => {
  if (!cachedTimestamp) return false;

  const cachedDate = new Date(cachedTimestamp);
  if (Number.isNaN(cachedDate.getTime())) return false;

  const now = new Date();
  const nowParts = getBucharestParts(now);
  const cachedParts = getBucharestParts(cachedDate);

  if (!isAfterBnrRefreshWindow(now)) {
    return true;
  }

  return cachedParts.dateKey === nowParts.dateKey && isAfterBnrRefreshWindow(cachedDate);
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [displayCurrency, setDisplayCurrency] = useState(() => {
    // Load currency from localStorage or default to USD
    return localStorage.getItem('displayCurrency') || 'USD';
  });
  
  const [demoMode, setDemoMode] = useState(() => {
    // Load demo mode from localStorage or default to false
    return localStorage.getItem('demoMode') === 'true';
  });
  
  const [liveExchangeRates, setLiveExchangeRates] = useState<ExchangeRates | null>(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // Fetch exchange rates from BNR through our edge function.
  const fetchExchangeRates = useCallback(async () => {
    try {
      setLoadingRates(true);
      
      const cachedRates = localStorage.getItem('exchangeRates');
      const cachedTimestamp = localStorage.getItem('exchangeRatesTimestamp');
      
      if (cachedRates && shouldUseCachedExchangeRates(cachedTimestamp)) {
        const timestamp = new Date(cachedTimestamp);
        setLiveExchangeRates(JSON.parse(cachedRates));
        setLastFetched(timestamp);
        setLoadingRates(false);
        return;
      }
      
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
        
        localStorage.setItem('exchangeRates', JSON.stringify(data.rates));
        localStorage.setItem('exchangeRatesTimestamp', new Date().toISOString());
        if (data.sourceDate) {
          localStorage.setItem('exchangeRatesSourceDate', data.sourceDate);
        }
        
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
      setLiveExchangeRates(fallbackExchangeRates);
    } finally {
      setLoadingRates(false);
    }
  }, []);

  // Fetch exchange rates on mount
  useEffect(() => {
    fetchExchangeRates();
    
    // Local cache check only; Supabase is called once per Bucharest day after 13:30.
    const interval = setInterval(fetchExchangeRates, 30 * 60 * 1000);
    
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

  const toggleDemoMode = useCallback(() => {
    setDemoMode(prev => {
      const newDemoMode = !prev;
      localStorage.setItem('demoMode', newDemoMode.toString());
      console.log('Demo mode toggled to:', newDemoMode);
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('demoModeChanged', { 
        detail: { demoMode: newDemoMode } 
      }));
      
      return newDemoMode;
    });
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
      demoMode,
      toggleDemoMode,
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
