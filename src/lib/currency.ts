
export const exchangeRates = {
  USD: { USD: 1, EUR: 0.85, RON: 4.5 },
  EUR: { USD: 1.18, EUR: 1, RON: 5.3 },
  RON: { USD: 0.22, EUR: 0.19, RON: 1 }
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  // Handle invalid inputs
  if (isNaN(amount) || amount === null || amount === undefined) {
    console.log('convertCurrency: Invalid amount received:', amount);
    return 0;
  }
  
  if (fromCurrency === toCurrency) return amount;
  
  const fromRates = exchangeRates[fromCurrency as keyof typeof exchangeRates];
  if (!fromRates) {
    console.log('convertCurrency: Invalid fromCurrency:', fromCurrency);
    return amount;
  }
  
  const rate = fromRates[toCurrency as keyof typeof fromRates];
  if (!rate) {
    console.log('convertCurrency: Invalid toCurrency:', toCurrency, 'for fromCurrency:', fromCurrency);
    return amount;
  }
  
  const result = amount * rate;
  return isNaN(result) ? 0 : result;
};

export const formatCurrency = (amount: number, currency: string): string => {
  // Handle invalid inputs
  if (isNaN(amount) || amount === null || amount === undefined) {
    console.log('formatCurrency: Invalid amount received:', amount);
    amount = 0;
  }
  
  const symbols = { USD: '$', EUR: '€', RON: 'RON ' };
  const symbol = symbols[currency as keyof typeof symbols] || '$';
  return currency === 'RON' ? `${symbol}${amount.toFixed(2)}` : `${symbol}${amount.toFixed(2)}`;
};
