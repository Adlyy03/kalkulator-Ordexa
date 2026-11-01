import {
  calculateContributionMargin,
  calculateBEPRestaurants,
  calculateBEPRevenue,
  calculateBEPProgress,
  calculateBreakEven
} from '../../engine/break-even';

describe('Break Even Engine', () => {
  describe('calculateContributionMargin', () => {
    it('should calculate contribution margin', () => {
      expect(calculateContributionMargin(199000, 50000)).toBe(149000);
      expect(calculateContributionMargin(100000, 30000)).toBe(70000);
    });

    it('should handle zero variable cost', () => {
      expect(calculateContributionMargin(199000, 0)).toBe(199000);
    });

    it('should handle negative margin', () => {
      expect(calculateContributionMargin(50000, 100000)).toBe(-50000);
    });
  });

  describe('calculateBEPRestaurants', () => {
    it('should calculate BEP and round up', () => {
      expect(calculateBEPRestaurants(2000000, 100000)).toBe(20);
      expect(calculateBEPRestaurants(2500000, 100000)).toBe(25);
    });

    it('should round up fractional results', () => {
      expect(calculateBEPRestaurants(2000000, 149000)).toBe(14); // 13.42 -> 14
    });

    it('should return N/A for zero or negative margin', () => {
      expect(calculateBEPRestaurants(2000000, 0)).toBe('N/A');
      expect(calculateBEPRestaurants(2000000, -50000)).toBe('N/A');
    });
  });

  describe('calculateBEPRevenue', () => {
    it('should calculate BEP revenue', () => {
      expect(calculateBEPRevenue(20, 100000)).toBe(2000000);
    });

    it('should return N/A if BEP restaurants is N/A', () => {
      expect(calculateBEPRevenue('N/A', 100000)).toBe('N/A');
    });
  });

  describe('calculateBEPProgress', () => {
    it('should calculate progress percentage', () => {
      expect(calculateBEPProgress(10, 20)).toBe(50);
      expect(calculateBEPProgress(15, 20)).toBe(75);
    });

    it('should cap at 100%', () => {
      expect(calculateBEPProgress(25, 20)).toBe(100);
    });

    it('should return N/A if BEP is N/A', () => {
      expect(calculateBEPProgress(10, 'N/A')).toBe('N/A');
    });

    it('should return N/A if BEP is zero', () => {
      expect(calculateBEPProgress(10, 0)).toBe('N/A');
    });
  });

  describe('calculateBreakEven (full)', () => {
    it('should calculate complete BEP for achievable scenario', () => {
      const input = {
        fixedCost: 2000000,
        arpa: 199000,
        variableCostPerRestaurant: 50000
      };

      const result = calculateBreakEven(input);

      expect(result.contributionMargin).toBe(149000);
      expect(result.breakEvenRestaurants).toBe(14); // ceil(2000000 / 149000)
      expect(result.breakEvenRevenue).toBe(2786000); // 14 * 199000
      expect(result.isAchievable).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should handle zero fixed cost', () => {
      const input = {
        fixedCost: 0,
        arpa: 199000,
        variableCostPerRestaurant: 50000
      };

      const result = calculateBreakEven(input);

      expect(result.breakEvenRestaurants).toBe(0);
      expect(result.breakEvenRevenue).toBe(0);
      expect(result.isAchievable).toBe(true);
    });

    it('should mark as unachievable when variable cost exceeds ARPA', () => {
      const input = {
        fixedCost: 2000000,
        arpa: 50000,
        variableCostPerRestaurant: 100000
      };

      const result = calculateBreakEven(input);

      expect(result.contributionMargin).toBe(-50000);
      expect(result.breakEvenRestaurants).toBe('N/A');
      expect(result.breakEvenRevenue).toBe('N/A');
      expect(result.isAchievable).toBe(false);
      expect(result.message).toBe(
        'BEP cannot be achieved with current cost structure. Variable cost per restaurant exceeds ARPA.'
      );
    });

    it('should mark as unachievable when margin is exactly zero', () => {
      const input = {
        fixedCost: 2000000,
        arpa: 100000,
        variableCostPerRestaurant: 100000
      };

      const result = calculateBreakEven(input);

      expect(result.contributionMargin).toBe(0);
      expect(result.isAchievable).toBe(false);
    });
  });
});
