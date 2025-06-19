
export const getTimeLabel = (pricingType: string) => {
  switch (pricingType) {
    case 'hourly':
      return 'Hours Worked';
    case 'daily':
      return 'Days Worked';
    default:
      return 'Time Worked';
  }
};

export const getStepValue = (pricingType: string) => {
  switch (pricingType) {
    case 'hourly':
      return '0.25';
    case 'daily':
      return '0.5';
    default:
      return '0.1';
  }
};

export const getPlaceholder = (pricingType: string) => {
  switch (pricingType) {
    case 'hourly':
      return 'e.g., 2.5';
    case 'daily':
      return 'e.g., 1.5';
    default:
      return 'e.g., 1';
  }
};

export const getButtonText = (pricingType: string) => {
  switch (pricingType) {
    case 'daily':
      return 'Log Days';
    default:
      return 'Log Hours';
  }
};

export const convertToHours = (value: number, pricingType: string) => {
  switch (pricingType) {
    case 'hourly':
      return value;
    case 'daily':
      return value * 8; // 8 hours per day
    default:
      return value;
  }
};
