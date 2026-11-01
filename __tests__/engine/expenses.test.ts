import {
  toMonthlyAmount,
  calculateFixedCost,
  calculateVariableCost,
  calculateTotalMonthlyExpenses,
  calculateTotalAnnualExpenses,
  groupByCategory,
  calculateExpenses,
  type Expense
} from '../../engine/expenses';

describe('Expenses Engine', () => {
  const sampleExpenses: Expense[] = [
    { name: 'Server', amount: 500000, type: 'FIXED', frequency: 'MONTHLY', categoryId: 'infra' },
    { name: 'Domain', amount: 1200000, type: 'FIXED', frequency: 'ANNUAL', categoryId: 'infra' },
    { name: 'Marketing', amount: 1000000, type: 'VARIABLE', frequency: 'MONTHLY', categoryId: 'marketing' },
    { name: 'Setup Cost', amount: 5000000, type: 'ONE_TIME', frequency: 'ONE_TIME', categoryId: 'dev' }
  ];

  describe('toMonthlyAmount', () => {
    it('should convert monthly amount', () => {
      expect(toMonthlyAmount(500000, 'MONTHLY')).toBe(500000);
    });

    it('should convert annual to monthly', () => {
      expect(toMonthlyAmount(1200000, 'ANNUAL')).toBe(100000);
    });

    it('should return 0 for one-time', () => {
      expect(toMonthlyAmount(5000000, 'ONE_TIME')).toBe(0);
    });
  });

  describe('calculateFixedCost', () => {
    it('should sum all fixed costs as monthly', () => {
      const result = calculateFixedCost(sampleExpenses);
      expect(result).toBe(600000); // 500000 + (1200000/12)
    });

    it('should handle empty expenses', () => {
      expect(calculateFixedCost([])).toBe(0);
    });
  });

  describe('calculateVariableCost', () => {
    it('should sum all variable costs as monthly', () => {
      const result = calculateVariableCost(sampleExpenses);
      expect(result).toBe(1000000);
    });
  });

  describe('calculateTotalMonthlyExpenses', () => {
    it('should sum all recurring expenses', () => {
      const result = calculateTotalMonthlyExpenses(sampleExpenses);
      expect(result).toBe(1600000); // 500000 + 100000 + 1000000
    });

    it('should exclude one-time costs', () => {
      const expenses: Expense[] = [
        { name: 'Monthly', amount: 100000, type: 'FIXED', frequency: 'MONTHLY', categoryId: 'test' },
        { name: 'One Time', amount: 500000, type: 'ONE_TIME', frequency: 'ONE_TIME', categoryId: 'test' }
      ];
      expect(calculateTotalMonthlyExpenses(expenses)).toBe(100000);
    });

    it('should handle zero expenses', () => {
      expect(calculateTotalMonthlyExpenses([])).toBe(0);
    });
  });

  describe('calculateTotalAnnualExpenses', () => {
    it('should calculate annual total including one-time', () => {
      const result = calculateTotalAnnualExpenses(sampleExpenses);
      expect(result).toBe(24200000); // (1600000 * 12) + 5000000
    });
  });

  describe('groupByCategory', () => {
    it('should group expenses by category', () => {
      const result = groupByCategory(sampleExpenses);
      
      expect(result.infra).toBe(600000); // 500000 + 100000
      expect(result.marketing).toBe(1000000);
      expect(result.dev).toBe(0); // One-time excluded
    });
  });

  describe('calculateExpenses (full)', () => {
    it('should calculate complete expense metrics', () => {
      const result = calculateExpenses(sampleExpenses);
      
      expect(result.totalFixedCost).toBe(600000);
      expect(result.totalVariableCost).toBe(1000000);
      expect(result.totalMonthlyExpenses).toBe(1600000);
      expect(result.totalAnnualExpenses).toBe(24200000);
      expect(result.expensesByCategory.infra).toBe(600000);
      expect(result.expensesByCategory.marketing).toBe(1000000);
    });

    it('should handle zero expenses', () => {
      const result = calculateExpenses([]);
      
      expect(result.totalFixedCost).toBe(0);
      expect(result.totalVariableCost).toBe(0);
      expect(result.totalMonthlyExpenses).toBe(0);
      expect(result.totalAnnualExpenses).toBe(0);
    });
  });
});
