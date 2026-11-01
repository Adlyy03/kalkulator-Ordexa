import {
  calculateNetGrowth,
  calculateEndingCustomers,
  calculateCustomerChurnRate,
  calculateRevenueChurnRate,
  calculateSubscriptionMetrics
} from '../../engine/subscription';

describe('Subscription Engine', () => {
  describe('calculateNetGrowth', () => {
    it('should calculate net growth', () => {
      expect(calculateNetGrowth(10, 2)).toBe(8);
      expect(calculateNetGrowth(5, 3)).toBe(2);
    });

    it('should handle negative growth', () => {
      expect(calculateNetGrowth(2, 5)).toBe(-3);
    });

    it('should handle zero new customers', () => {
      expect(calculateNetGrowth(0, 3)).toBe(-3);
    });
  });

  describe('calculateEndingCustomers', () => {
    it('should calculate ending customers', () => {
      expect(calculateEndingCustomers(100, 10, 5)).toBe(105);
      expect(calculateEndingCustomers(50, 20, 10)).toBe(60);
    });

    it('should handle zero starting customers', () => {
      expect(calculateEndingCustomers(0, 10, 0)).toBe(10);
    });

    it('should handle 100% churn', () => {
      expect(calculateEndingCustomers(10, 0, 10)).toBe(0);
    });
  });

  describe('calculateCustomerChurnRate', () => {
    it('should calculate churn rate percentage', () => {
      expect(calculateCustomerChurnRate(5, 100)).toBe(5);
      expect(calculateCustomerChurnRate(10, 50)).toBe(20);
    });

    it('should return N/A for zero starting customers', () => {
      expect(calculateCustomerChurnRate(5, 0)).toBe('N/A');
    });

    it('should handle 100% churn', () => {
      expect(calculateCustomerChurnRate(100, 100)).toBe(100);
    });
  });

  describe('calculateRevenueChurnRate', () => {
    it('should calculate revenue churn rate', () => {
      expect(calculateRevenueChurnRate(500000, 10000000)).toBe(5);
      expect(calculateRevenueChurnRate(1000000, 5000000)).toBe(20);
    });

    it('should return N/A for zero starting MRR', () => {
      expect(calculateRevenueChurnRate(100000, 0)).toBe('N/A');
    });
  });

  describe('calculateSubscriptionMetrics (full)', () => {
    it('should calculate complete subscription metrics', () => {
      const result = calculateSubscriptionMetrics(100, 15, 5);
      
      expect(result.startingCustomers).toBe(100);
      expect(result.newCustomers).toBe(15);
      expect(result.churnedCustomers).toBe(5);
      expect(result.endingCustomers).toBe(110);
      expect(result.netGrowth).toBe(10);
      expect(result.customerChurnRate).toBe(5);
    });

    it('should handle zero starting customers', () => {
      const result = calculateSubscriptionMetrics(0, 10, 0);
      
      expect(result.endingCustomers).toBe(10);
      expect(result.netGrowth).toBe(10);
      expect(result.customerChurnRate).toBe('N/A');
    });
  });
});
