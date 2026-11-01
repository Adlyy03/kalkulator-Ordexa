/**
 * Revenue calculation engine
 * Handles MRR, ARR, ARPA calculations
 */

export interface Package {
  name: string;
  monthlyPrice: number;
  restaurantCount: number;
}

export interface RevenueResult {
  packageRevenues: { [packageName: string]: number };
  totalMRR: number;
  totalARR: number;
  totalRestaurants: number;
  arpa: number | 'N/A';
}

/**
 * Calculate package revenue
 */
export function calculatePackageRevenue(restaurantCount: number, price: number): number {
  return restaurantCount * price;
}

/**
 * Calculate MRR (Monthly Recurring Revenue)
 */
export function calculateMRR(packages: Package[], otherRecurringRevenue: number = 0): number {
  const packageMRR = packages.reduce((sum, pkg) => {
    return sum + calculatePackageRevenue(pkg.restaurantCount, pkg.monthlyPrice);
  }, 0);
  
  return packageMRR + otherRecurringRevenue;
}

/**
 * Calculate ARR (Annual Recurring Revenue)
 */
export function calculateARR(mrr: number): number {
  return mrr * 12;
}

/**
 * Calculate ARPA (Average Revenue Per Account)
 */
export function calculateARPA(mrr: number, activeRestaurants: number): number | 'N/A' {
  if (activeRestaurants === 0) return 'N/A';
  return mrr / activeRestaurants;
}

/**
 * Calculate total active restaurants
 */
export function calculateTotalRestaurants(packages: Package[]): number {
  return packages.reduce((sum, pkg) => sum + pkg.restaurantCount, 0);
}

/**
 * Main revenue calculation
 */
export function calculateRevenue(
  packages: Package[],
  otherRecurringRevenue: number = 0
): RevenueResult {
  const packageRevenues: { [key: string]: number } = {};
  
  packages.forEach(pkg => {
    packageRevenues[pkg.name] = calculatePackageRevenue(pkg.restaurantCount, pkg.monthlyPrice);
  });
  
  const totalMRR = calculateMRR(packages, otherRecurringRevenue);
  const totalARR = calculateARR(totalMRR);
  const totalRestaurants = calculateTotalRestaurants(packages);
  const arpa = calculateARPA(totalMRR, totalRestaurants);
  
  return {
    packageRevenues,
    totalMRR,
    totalARR,
    totalRestaurants,
    arpa
  };
}
