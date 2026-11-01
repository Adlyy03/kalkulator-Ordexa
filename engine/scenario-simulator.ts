import { simulateGrowth, type MonthGrowthData } from './growth-simulator';

export interface ScenarioVariables {
  startingRestaurants: number;
  newRestaurantsPerMonth: number;
  monthlyChurnRate: number; // e.g. 0.05
  arpa: number;
  fixedCost: number;
  variableCostPerRestaurant: number;
}

export type ScenarioType = 'pessimistic' | 'realistic' | 'optimistic';

export interface ScenarioProfile {
  name: string;
  type: ScenarioType;
  variables: ScenarioVariables;
  simulationMonths: 3 | 6 | 12 | 24 | 36;
}

export interface ScenarioResult {
  type: ScenarioType;
  title: string;
  finalRestaurants: number;
  finalMRR: number;
  finalARR: number;
  monthlyExpenses: number;
  monthlyNetProfit: number;
  cumulativeCashFlow: number;
  isProfitable: boolean;
  monthlyBreakdown: MonthGrowthData[];
}

export interface MultiScenarioComparison {
  pessimistic: ScenarioResult;
  realistic: ScenarioResult;
  optimistic: ScenarioResult;
  simulationMonths: number;
}

/**
 * Calculates a single isolated scenario without mutating original data.
 */
export function calculateScenario(profile: ScenarioProfile): ScenarioResult {
  const vars = { ...profile.variables };
  const baseExpenses = vars.fixedCost + (vars.startingRestaurants * vars.variableCostPerRestaurant);

  const growthResult = simulateGrowth({
    startingRestaurants: vars.startingRestaurants,
    newRestaurantsPerMonth: vars.newRestaurantsPerMonth,
    monthlyChurnRate: vars.monthlyChurnRate,
    arpa: vars.arpa,
    baseMonthlyExpenses: baseExpenses,
    simulationMonths: profile.simulationMonths,
  });

  const finalResto = growthResult.finalRestaurants;
  const finalExpenses = vars.fixedCost + (finalResto * vars.variableCostPerRestaurant);
  const finalMRR = growthResult.finalMRR;
  const netProfit = finalMRR - finalExpenses;

  const titles: Record<ScenarioType, string> = {
    pessimistic: 'Skenario Pesimis',
    realistic: 'Skenario Realistis',
    optimistic: 'Skenario Optimis',
  };

  return {
    type: profile.type,
    title: titles[profile.type] || profile.name,
    finalRestaurants: finalResto,
    finalMRR,
    finalARR: growthResult.finalARR,
    monthlyExpenses: finalExpenses,
    monthlyNetProfit: netProfit,
    cumulativeCashFlow: growthResult.totalCumulativeProfit,
    isProfitable: netProfit > 0,
    monthlyBreakdown: growthResult.monthlyData,
  };
}

/**
 * Runs 3 standard scenarios (Pesimis, Realistis, Optimis) simultaneously.
 */
export function compareScenarios(
  base: ScenarioVariables,
  months: 3 | 6 | 12 | 24 | 36 = 12
): MultiScenarioComparison {
  // Pessimistic: -50% growth, +50% churn, slightly higher costs
  const pessimisticVars: ScenarioVariables = {
    startingRestaurants: base.startingRestaurants,
    newRestaurantsPerMonth: Math.max(1, Math.round(base.newRestaurantsPerMonth * 0.5)),
    monthlyChurnRate: Math.min(0.3, base.monthlyChurnRate * 1.5 || 0.08),
    arpa: base.arpa * 0.9,
    fixedCost: base.fixedCost * 1.1,
    variableCostPerRestaurant: base.variableCostPerRestaurant * 1.15,
  };

  // Realistic: Base values
  const realisticVars: ScenarioVariables = {
    ...base,
  };

  // Optimistic: +50% growth, -40% churn, slight cost efficiency
  const optimisticVars: ScenarioVariables = {
    startingRestaurants: base.startingRestaurants,
    newRestaurantsPerMonth: Math.round(base.newRestaurantsPerMonth * 1.6),
    monthlyChurnRate: Math.max(0.01, (base.monthlyChurnRate || 0.04) * 0.6),
    arpa: base.arpa * 1.1,
    fixedCost: base.fixedCost,
    variableCostPerRestaurant: base.variableCostPerRestaurant * 0.9,
  };

  return {
    pessimistic: calculateScenario({
      name: 'Pesimis',
      type: 'pessimistic',
      variables: pessimisticVars,
      simulationMonths: months,
    }),
    realistic: calculateScenario({
      name: 'Realistis',
      type: 'realistic',
      variables: realisticVars,
      simulationMonths: months,
    }),
    optimistic: calculateScenario({
      name: 'Optimis',
      type: 'optimistic',
      variables: optimisticVars,
      simulationMonths: months,
    }),
    simulationMonths: months,
  };
}
