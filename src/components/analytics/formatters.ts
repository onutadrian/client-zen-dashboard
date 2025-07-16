
// Utility functions for formatting analytics values
export const formatMetric = (value: any, isCurrency = false, currency = '', demoMode = false) => {
  // Return dash if demo mode is enabled and this is a currency value
  if (demoMode && isCurrency) {
    return '—';
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  
  if (isNaN(numValue)) return value;
  
  const rounded = Math.round(numValue);
  
  if (rounded >= 1000) {
    const kValue = (rounded / 1000).toFixed(2).replace(/\.?0+$/, '');
    if (isCurrency) {
      return `${currency === 'RON' ? 'RON ' : (currency === 'EUR' ? '€' : '$')}${kValue}K`;
    }
    return `${kValue}K`;
  }
  
  if (isCurrency) {
    return `${currency === 'RON' ? 'RON ' : (currency === 'EUR' ? '€' : '$')}${rounded}`;
  }
  
  return rounded.toString();
};

// Special formatting for hours - always show actual hours, not abbreviated
export const formatHours = (hours: any) => {
  const numHours = typeof hours === 'string' ? parseFloat(hours.replace(/[^0-9.-]/g, '')) : hours;
  if (isNaN(numHours)) return hours;
  return `${Math.round(numHours)}h`;
};

export const getOriginalValue = (value: any, isCurrency = false, demoMode = false) => {
  // Return dash if demo mode is enabled and this is a currency value
  if (demoMode && isCurrency) {
    return '—';
  }
  
  if (isCurrency) {
    return value;
  }
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  return Math.round(numValue).toString();
};

export const getTrendData = (metric: string, currentValue?: number, previousValue?: number) => {
  // If previous period data is provided, calculate actual trend
  if (currentValue !== undefined && previousValue !== undefined && previousValue > 0) {
    const change = Math.round(((currentValue - previousValue) / previousValue) * 100);
    return {
      change: Math.abs(change),
      isIncrease: change >= 0
    };
  }
  
  // Fallback to static data when no comparison data is available
  const trends = {
    'Total Clients': { change: 15, isIncrease: true },
    'Total Time': { change: 23, isIncrease: true },
    'Total Revenue': { change: 8, isIncrease: true },
    'Monthly Costs': { change: 12, isIncrease: false },
    'Total Paid to Date': { change: 18, isIncrease: true },
    'Net Profit': { change: 18, isIncrease: true }
  };
  return trends[metric] || { change: 0, isIncrease: true };
};
