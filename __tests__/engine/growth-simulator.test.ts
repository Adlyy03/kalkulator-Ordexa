import { simulateGrowth } from '../../engine/growth-simulator';

describe('Growth Simulator Engine', () => {
  it('correctly simulates 12 months with steady growth', () => {
    const result = simulateGrowth({
      startingRestaurants: 10,
      newRestaurantsPerMonth: 5,
      monthlyChurnRate: 0.05,
      arpa: 200000,
      baseMonthlyExpenses: 1000000,
      simulationMonths: 12,
    });

    expect(result.monthlyData.length).toBe(12);
    expect(result.finalRestaurants).toBeGreaterThan(10);
    expect(result.finalMRR).toBeGreaterThan(2000000);
    expect(result.finalARR).toBe(result.finalMRR * 12);
    expect(result.totalCumulativeRevenue).toBeGreaterThan(0);
  });

  it('calculates CAC and LTV correctly', () => {
    const result = simulateGrowth({
      startingRestaurants: 0,
      newRestaurantsPerMonth: 10,
      monthlyChurnRate: 0.05, // 5% monthly churn
      arpa: 200000,
      marketingBudget: 5000000,
      grossMarginPct: 80,
      simulationMonths: 6,
    });

    // CAC = 5,000,000 / 10 = 500,000
    expect(result.cac).toBe(500000);
    // LTV = (200,000 * 0.8) / 0.05 = 160,000 / 0.05 = 3,200,000
    expect(result.ltv).toBe(3200000);
    // LTV:CAC = 3,200,000 / 500,000 = 6.4
    expect(result.ltvToCacRatio).toBe(6.4);
  });

  it('handles zero growth and 100% churn edge cases', () => {
    const result = simulateGrowth({
      startingRestaurants: 10,
      newRestaurantsPerMonth: 0,
      monthlyChurnRate: 1.0, // 100% churn
      arpa: 100000,
      simulationMonths: 3,
    });

    // Month 1: 10 - 10 = 0 ending
    expect(result.monthlyData[0].endingRestaurants).toBe(0);
    expect(result.finalRestaurants).toBe(0);
  });
});
