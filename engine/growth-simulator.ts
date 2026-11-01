import { safeDivide, roundTo } from './math';

export interface GrowthSimulatorInput {
  startingRestaurants: number;
  newRestaurantsPerMonth: number;
  monthlyChurnRate: number; // Decimal (e.g. 0.05 for 5%)
  arpa: number; // Average Revenue Per Account (per month)
  monthlyExpenseGrowthRate?: number; // Decimal (e.g. 0.02 for 2%)
  baseMonthlyExpenses?: number;
  marketingBudget?: number;
  cac?: number; // Customer Acquisition Cost
  grossMarginPct?: number; // e.g. 80 for 80%
  simulationMonths: 3 | 6 | 12 | 24 | 36;
}

export interface MonthGrowthData {
  month: number;
  startingRestaurants: number;
  newRestaurants: number;
  churnedRestaurants: number;
  endingRestaurants: number;
  mrr: number;
  expenses: number;
  netProfit: number;
  cumulativeRevenue: number;
  cumulativeProfit: number;
}

export interface GrowthSimulatorResult {
  monthlyData: MonthGrowthData[];
  finalRestaurants: number;
  finalMRR: number;
  finalARR: number;
  totalCumulativeRevenue: number;
  totalCumulativeProfit: number;
  ltv: number | 'N/A';
  cac: number | 'N/A';
  ltvToCacRatio: number | 'N/A';
  breakEvenMonth: number | 'N/A'; // Month where cumulative profit becomes positive
}

/**
 * Simulates restaurant growth, revenue, expenses, and LTV:CAC over 3-36 months.
 * Follows PRD Section 11 specifications.
 */
export function simulateGrowth(input: GrowthSimulatorInput): GrowthSimulatorResult {
  const {
    startingRestaurants,
    newRestaurantsPerMonth,
    monthlyChurnRate,
    arpa,
    monthlyExpenseGrowthRate = 0,
    baseMonthlyExpenses = 0,
    marketingBudget = 0,
    cac: directCac,
    grossMarginPct = 80,
    simulationMonths,
  } = input;

  const monthlyData: MonthGrowthData[] = [];
  let currentStarting = Math.max(0, startingRestaurants);
  let currentExpenses = Math.max(0, baseMonthlyExpenses);
  let cumulativeRevenue = 0;
  let cumulativeProfit = 0;
  let breakEvenMonth: number | 'N/A' = 'N/A';

  for (let m = 1; m <= simulationMonths; m++) {
    const churned = roundTo(currentStarting * Math.max(0, monthlyChurnRate), 2);
    const ending = Math.max(0, currentStarting + newRestaurantsPerMonth - churned);
    const mrr = ending * arpa;
    const netProfit = mrr - currentExpenses;

    cumulativeRevenue += mrr;
    cumulativeProfit += netProfit;

    if (breakEvenMonth === 'N/A' && cumulativeProfit >= 0 && mrr > 0) {
      breakEvenMonth = m;
    }

    monthlyData.push({
      month: m,
      startingRestaurants: currentStarting,
      newRestaurants: newRestaurantsPerMonth,
      churnedRestaurants: churned,
      endingRestaurants: ending,
      mrr,
      expenses: currentExpenses,
      netProfit,
      cumulativeRevenue,
      cumulativeProfit,
    });

    currentStarting = ending;
    currentExpenses = currentExpenses * (1 + monthlyExpenseGrowthRate);
  }

  const lastMonth = monthlyData[monthlyData.length - 1];
  const finalRestaurants = lastMonth ? Math.round(lastMonth.endingRestaurants) : 0;
  const finalMRR = lastMonth ? lastMonth.mrr : 0;
  const finalARR = finalMRR * 12;

  // CAC calculation: if direct CAC provided, use it; else marketingBudget / newRestaurants
  let resolvedCac: number | 'N/A' = 'N/A';
  if (typeof directCac === 'number' && directCac > 0) {
    resolvedCac = directCac;
  } else if (marketingBudget > 0 && newRestaurantsPerMonth > 0) {
    resolvedCac = roundTo(marketingBudget / newRestaurantsPerMonth, 2);
  }

  // LTV calculation: (ARPA * GrossMarginPct / 100) / ChurnRate
  let resolvedLtv: number | 'N/A' = 'N/A';
  if (monthlyChurnRate > 0 && arpa > 0) {
    const marginRatio = (grossMarginPct > 0 ? grossMarginPct : 100) / 100;
    resolvedLtv = roundTo((arpa * marginRatio) / monthlyChurnRate, 2);
  }

  // LTV:CAC Ratio
  let ltvToCacRatio: number | 'N/A' = 'N/A';
  if (typeof resolvedLtv === 'number' && typeof resolvedCac === 'number' && resolvedCac > 0) {
    ltvToCacRatio = roundTo(resolvedLtv / resolvedCac, 2);
  }

  return {
    monthlyData,
    finalRestaurants,
    finalMRR,
    finalARR,
    totalCumulativeRevenue: cumulativeRevenue,
    totalCumulativeProfit: cumulativeProfit,
    ltv: resolvedLtv,
    cac: resolvedCac,
    ltvToCacRatio,
    breakEvenMonth,
  };
}
