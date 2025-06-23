import { useState, useEffect, useCallback } from 'react';
import { fallbackExchangeRates, convertCurrency as convertCurrencyUtil } from '@/lib/currency';

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

  // Fetch exchange rates from the API
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
      
      // Fetch new rates
      const apiKey = import.meta.env.VITE_APILAYER_API_KEY;
      if (!apiKey) {
        console.error('API key not found. Please set VITE_APILAYER_API_KEY in .env file');
        throw new Error('API key not found');
      }
      
      const response = await fetch(`https://api.apilayer.com/currency_data/live?source=EUR&currencies=USD,RON`, {
        headers: {
          'apikey': apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`API request failed: ${data.error?.info || 'Unknown error'}`);
      }
      
      // Format the rates into our expected structure
      // The API returns rates relative to EUR, so we need to calculate cross-rates
      const eurToUsd = data.quotes.EURUSD;
      const eurToRon = data.quotes.EURRON;
      
      const rates: ExchangeRates = {
        EUR: {
          EUR: 1,
          USD: eurToUsd,
          RON: eurToRon
        },
        USD: {
          EUR: 1 / eurToUsd,
          USD: 1,
          RON: eurToRon / eurToUsd
        },
        RON: {
          EUR: 1 / eurToRon,
          USD: eurToUsd / eurToRon,
          RON: 1
        }
      };
      
      console.log('Fetched live exchange rates:', rates);
      
      // Cache the rates
      localStorage.setItem('exchangeRates', JSON.stringify(rates));
      localStorage.setItem('exchangeRatesTimestamp', new Date().toISOString());
      
      setLiveExchangeRates(rates);
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