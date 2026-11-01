/**
 * Break Even Point calculation engine
 * Determines minimum restaurants needed to reach BEP
 */

export interface BreakEvenInput {
  fixedCost: number;
  arpa: number; // Average Revenue Per Account
  variableCostPerRestaurant: number;
}

export interface BreakEvenResult {
  contributionMargin: number | 'N/A';
  breakEvenRestaurants: number | 'N/A';
  breakEvenRevenue: number | 'N/A';
  isAchievable: boolean;
  message?: string;
}

/**
 * Calculate contribution margin per restaurant
 */
export function calculateContributionMargin(
  arpa: number,
  variableCostPerRestaurant: number
): number {
  return arpa - variableCostPerRestaurant;
}

/**
 * Calculate BEP restaurants (rounded up)
 */
export function calculateBEPRestaurants(
  fixedCost: number,
  contributionMargin: number
): number | 'N/A' {
  if (contributionMargin <= 0) return 'N/A';
  return Math.ceil(fixedCost / contributionMargin);
}

/**
 * Calculate BEP revenue
 */
export function calculateBEPRevenue(
  bepRestaurants: number | 'N/A',
  arpa: number
): number | 'N/A' {
  if (bepRestaurants === 'N/A') return 'N/A';
  return bepRestaurants * arpa;
}

/**
 * Calculate progress to BEP (percentage)
 */
export function calculateBEPProgress(
  currentRestaurants: number,
  bepRestaurants: number | 'N/A'
): number | 'N/A' {
  if (bepRestaurants === 'N/A' || bepRestaurants === 0) return 'N/A';
  return Math.min((currentRestaurants / bepRestaurants) * 100, 100);
}

/**
 * Main break even calculation
 */
export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const contributionMargin = calculateContributionMargin(
    input.arpa,
    input.variableCostPerRestaurant
  );
  
  // Check if BEP is achievable
  if (contributionMargin <= 0) {
    return {
      contributionMargin: contributionMargin,
      breakEvenRestaurants: 'N/A',
      breakEvenRevenue: 'N/A',
      isAchievable: false,
      message: 'BEP cannot be achieved with current cost structure. Variable cost per restaurant exceeds ARPA.'
    };
  }
  
  const bepRestaurants = calculateBEPRestaurants(input.fixedCost, contributionMargin);
  const bepRevenue = calculateBEPRevenue(bepRestaurants, input.arpa);
  
  return {
    contributionMargin,
    breakEvenRestaurants: bepRestaurants,
    breakEvenRevenue: bepRevenue,
    isAchievable: true
  };
}
