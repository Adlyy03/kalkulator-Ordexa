/**
 * Profit & Loss calculation engine
 * Handles gross profit, operating profit, net profit, margins
 */

export interface ProfitLossInput {
  totalRevenue: number;
  directCosts: number;
  operatingExpenses: number;
}

export interface ProfitLossResult {
  totalRevenue: number;
  directCosts: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingProfit: number;
  netProfit: number;
  grossProfitMargin: number | 'N/A';
  netProfitMargin: number | 'N/A';
  status: 'PROFIT' | 'BREAK_EVEN' | 'LOSS';
}

/**
 * Calculate gross profit
 */
export function calculateGrossProfit(revenue: number, directCosts: number): number {
  return revenue - directCosts;
}

/**
 * Calculate operating profit
 */
export function calculateOperatingProfit(grossProfit: number, operatingExpenses: number): number {
  return grossProfit - operatingExpenses;
}

/**
 * Calculate net profit
 */
export function calculateNetProfit(totalRevenue: number, totalExpenses: number): number {
  return totalRevenue - totalExpenses;
}

/**
 * Calculate gross profit margin (percentage)
 */
export function calculateGrossProfitMargin(
  grossProfit: number,
  revenue: number
): number | 'N/A' {
  if (revenue === 0) return 'N/A';
  return (grossProfit / revenue) * 100;
}

/**
 * Calculate net profit margin (percentage)
 */
export function calculateNetProfitMargin(
  netProfit: number,
  revenue: number
): number | 'N/A' {
  if (revenue === 0) return 'N/A';
  return (netProfit / revenue) * 100;
}

/**
 * Determine financial status
 */
export function determineStatus(netProfit: number): 'PROFIT' | 'BREAK_EVEN' | 'LOSS' {
  if (netProfit > 0) return 'PROFIT';
  if (netProfit === 0) return 'BREAK_EVEN';
  return 'LOSS';
}

/**
 * Main profit & loss calculation
 */
export function calculateProfitLoss(input: ProfitLossInput): ProfitLossResult {
  const grossProfit = calculateGrossProfit(input.totalRevenue, input.directCosts);
  const operatingProfit = calculateOperatingProfit(grossProfit, input.operatingExpenses);
  const totalExpenses = input.directCosts + input.operatingExpenses;
  const netProfit = calculateNetProfit(input.totalRevenue, totalExpenses);
  const grossProfitMargin = calculateGrossProfitMargin(grossProfit, input.totalRevenue);
  const netProfitMargin = calculateNetProfitMargin(netProfit, input.totalRevenue);
  const status = determineStatus(netProfit);
  
  return {
    totalRevenue: input.totalRevenue,
    directCosts: input.directCosts,
    grossProfit,
    operatingExpenses: input.operatingExpenses,
    operatingProfit,
    netProfit,
    grossProfitMargin,
    netProfitMargin,
    status
  };
}
