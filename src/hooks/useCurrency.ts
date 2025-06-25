
import { useState, useEffect, useCallback } from 'react';
import { fallbackExchangeRates, convertCurrency as convertCurrencyUtil } from '@/lib/currency';
import { supabase } from '@/integrations/supabase/client';

interface ExchangeRates {
  [currency: string]: {
    [currency: string]: number;
  };
}

export const useCurrency = () => {
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

  // Provide a convert function that uses the live rates
  const convert = useCallback((amount: number, fromCurrency: string, toCurrency: string): number => {
    return convertCurrencyUtil(amount, fromCurrency, toCurrency, liveExchangeRates || fallbackExchangeRates);
  }, [liveExchangeRates]);

  return {
    displayCurrency,
    updateCurrency,
    convert,
    loadingRates,
    lastFetched,
    refreshRates: fetchExchangeRates
  };
};
