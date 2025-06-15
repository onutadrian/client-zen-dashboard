
export const exchangeRates = {
  USD: { USD: 1, EUR: 0.85, RON: 4.5 },
  EUR: { USD: 1.18, EUR: 1, RON: 5.3 },
  RON: { USD: 0.22, EUR: 0.19, RON: 1 }
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return amount;
  return amount * exchangeRates[fromCurrency as keyof typeof exchangeRates][toCurrency as keyof typeof exchangeRates[keyof typeof exchangeRates]];
};

export const formatCurrency = (amount: number, currency: string): string => {
  const symbols = { USD: '$', EUR: '€', RON: 'RON ' };
  const symbol = symbols[currency as keyof typeof symbols] || '$';
  return currency === 'RON' ? `${symbol}${amount.toFixed(2)}` : `${symbol}${amount.toFixed(2)}`;
};
