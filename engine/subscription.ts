/**
 * Subscription metrics calculation engine
 * Handles churn, net growth, customer lifecycle
 */

export interface SubscriptionMetrics {
  startingCustomers: number;
  newCustomers: number;
  churnedCustomers: number;
  endingCustomers: number;
  netGrowth: number;
  customerChurnRate: number | 'N/A';
  revenueChurnRate: number | 'N/A';
}

/**
 * Calculate net customer growth
 */
export function calculateNetGrowth(newCustomers: number, churnedCustomers: number): number {
  return newCustomers - churnedCustomers;
}

/**
 * Calculate ending customers
 */
export function calculateEndingCustomers(
  startingCustomers: number,
  newCustomers: number,
  churnedCustomers: number
): number {
  return startingCustomers + newCustomers - churnedCustomers;
}

/**
 * Calculate customer churn rate (percentage)
 */
export function calculateCustomerChurnRate(
  churnedCustomers: number,
  startingCustomers: number
): number | 'N/A' {
  if (startingCustomers === 0) return 'N/A';
  return (churnedCustomers / startingCustomers) * 100;
}

/**
 * Calculate revenue churn rate (percentage)
 */
export function calculateRevenueChurnRate(
  lostMRR: number,
  startingMRR: number
): number | 'N/A' {
  if (startingMRR === 0) return 'N/A';
  return (lostMRR / startingMRR) * 100;
}

/**
 * Main subscription calculation
 */
export function calculateSubscriptionMetrics(
  startingCustomers: number,
  newCustomers: number,
  churnedCustomers: number
): SubscriptionMetrics {
  const netGrowth = calculateNetGrowth(newCustomers, churnedCustomers);
  const endingCustomers = calculateEndingCustomers(startingCustomers, newCustomers, churnedCustomers);
  const customerChurnRate = calculateCustomerChurnRate(churnedCustomers, startingCustomers);
  
  return {
    startingCustomers,
    newCustomers,
    churnedCustomers,
    endingCustomers,
    netGrowth,
    customerChurnRate,
    revenueChurnRate: 'N/A' // Calculated separately with MRR context
  };
}
