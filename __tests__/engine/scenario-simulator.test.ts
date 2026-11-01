import { compareScenarios, calculateScenario } from '../../engine/scenario-simulator';

describe('Scenario Simulator Engine', () => {
  const baseVars = {
    startingRestaurants: 10,
    newRestaurantsPerMonth: 5,
    monthlyChurnRate: 0.05,
    arpa: 199000,
    fixedCost: 2000000,
    variableCostPerRestaurant: 20000,
  };

  it('generates pessimistic, realistic, and optimistic scenarios', () => {
    const comparison = compareScenarios(baseVars, 12);

    expect(comparison.simulationMonths).toBe(12);
    expect(comparison.pessimistic.finalRestaurants).toBeLessThan(comparison.realistic.finalRestaurants);
    expect(comparison.realistic.finalRestaurants).toBeLessThan(comparison.optimistic.finalRestaurants);
    expect(comparison.pessimistic.finalMRR).toBeLessThan(comparison.optimistic.finalMRR);
  });

  it('keeps data completely isolated without mutation', () => {
    const originalStarting = baseVars.startingRestaurants;
    compareScenarios(baseVars, 6);
    expect(baseVars.startingRestaurants).toBe(originalStarting);
  });
});
