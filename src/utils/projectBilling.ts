export type FixedProjectBillingStatus = 'unbilled' | 'partial' | 'billed';

export const deriveFixedProjectBillingStatus = (
  fixedPrice?: number | null,
  billedAmount?: number | null
): FixedProjectBillingStatus => {
  const total = Math.max(0, Number(fixedPrice ?? 0));
  const billed = Math.max(0, Number(billedAmount ?? 0));

  if (billed <= 0) {
    return 'unbilled';
  }

  if (total > 0 && billed >= total) {
    return 'billed';
  }

  return 'partial';
};

export const getFixedProjectBillingStatusLabel = (status: FixedProjectBillingStatus) => {
  switch (status) {
    case 'billed':
      return 'Billed';
    case 'partial':
      return 'Partially Billed';
    default:
      return 'Unbilled';
  }
};
