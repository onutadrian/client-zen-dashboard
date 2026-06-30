
// Exchange rates will be dynamically fetched from the API
// These are fallback rates in case the API fails
export const fallbackExchangeRates = {
  USD: { USD: 1, EUR: 0.87, RON: 4.35, GBP: 0.74 },
  EUR: { USD: 1.15, EUR: 1, RON: 5, GBP: 0.85 },
  RON: { USD: 0.23, EUR: 0.2, RON: 1, GBP: 0.17 },
  GBP: { USD: 1.34, EUR: 1.17, RON: 5.85, GBP: 1 }
};

export const convertCurrency = (
  amount: number, 
  fromCurrency: string, 
  toCurrency: string,
  liveRates?: Record<string, Record<string, number>>
): number => {
  // Handle invalid inputs
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 0;
  }
  
  if (fromCurrency === toCurrency) return amount;
  
  // Use live rates if available, otherwise fall back to static rates
  const rates = liveRates || fallbackExchangeRates;
  
  const fromRates = rates[fromCurrency as keyof typeof rates];
  if (!fromRates) {
    return amount;
  }
  
  const rate = fromRates[toCurrency as keyof typeof fromRates];
  if (!rate) {
    return amount;
  }
  
  const result = amount * rate;
  return isNaN(result) ? 0 : result;
};

export const formatCurrency = (amount: number, currency: string): string => {
  // Handle invalid inputs
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }
  
  const symbols = { USD: '$', EUR: '€', RON: 'RON ' };
  const symbol = symbols[currency as keyof typeof symbols] || '$';
  return currency === 'RON' ? `${symbol}${amount.toFixed(2)}` : `${symbol}${amount.toFixed(2)}`;
};
