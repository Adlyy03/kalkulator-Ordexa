import {
  calculateGrossProfit,
  calculateOperatingProfit,
  calculateNetProfit,
  calculateGrossProfitMargin,
  calculateNetProfitMargin,
  determineStatus,
  calculateProfitLoss
} from '../../engine/profit-loss';

describe('Profit & Loss Engine', () => {
  describe('calculateGrossProfit', () => {
    it('should calculate gross profit', () => {
      expect(calculateGrossProfit(5000000, 2000000)).toBe(3000000);
      expect(calculateGrossProfit(10000000, 4000000)).toBe(6000000);
    });

    it('should handle zero revenue', () => {
      expect(calculateGrossProfit(0, 1000000)).toBe(-1000000);
    });

    it('should handle zero direct costs', () => {
      expect(calculateGrossProfit(5000000, 0)).toBe(5000000);
    });
  });

  describe('calculateOperatingProfit', () => {
    it('should calculate operating profit', () => {
      expect(calculateOperatingProfit(3000000, 1000000)).toBe(2000000);
    });

    it('should handle negative gross profit', () => {
      expect(calculateOperatingProfit(-1000000, 500000)).toBe(-1500000);
    });
  });

  describe('calculateNetProfit', () => {
    it('should calculate net profit', () => {
      expect(calculateNetProfit(5000000, 3000000)).toBe(2000000);
    });

    it('should handle expenses exceeding revenue', () => {
      expect(calculateNetProfit(2000000, 5000000)).toBe(-3000000);
    });

    it('should handle break even', () => {
      expect(calculateNetProfit(3000000, 3000000)).toBe(0);
    });
  });

  describe('calculateGrossProfitMargin', () => {
    it('should calculate gross profit margin percentage', () => {
      expect(calculateGrossProfitMargin(3000000, 5000000)).toBe(60);
      expect(calculateGrossProfitMargin(2000000, 10000000)).toBe(20);
    });

    it('should return N/A for zero revenue', () => {
      expect(calculateGrossProfitMargin(1000000, 0)).toBe('N/A');
    });

    it('should handle negative margin', () => {
      expect(calculateGrossProfitMargin(-1000000, 5000000)).toBe(-20);
    });
  });

  describe('calculateNetProfitMargin', () => {
    it('should calculate net profit margin percentage', () => {
      expect(calculateNetProfitMargin(2000000, 5000000)).toBe(40);
      expect(calculateNetProfitMargin(1000000, 10000000)).toBe(10);
    });

    it('should return N/A for zero revenue', () => {
      expect(calculateNetProfitMargin(1000000, 0)).toBe('N/A');
    });
  });

  describe('determineStatus', () => {
    it('should return PROFIT for positive net profit', () => {
      expect(determineStatus(1000000)).toBe('PROFIT');
      expect(determineStatus(1)).toBe('PROFIT');
    });

    it('should return BREAK_EVEN for zero net profit', () => {
      expect(determineStatus(0)).toBe('BREAK_EVEN');
    });

    it('should return LOSS for negative net profit', () => {
      expect(determineStatus(-1000000)).toBe('LOSS');
      expect(determineStatus(-1)).toBe('LOSS');
    });
  });

  describe('calculateProfitLoss (full)', () => {
    it('should calculate complete P&L for profitable scenario', () => {
      const input = {
        totalRevenue: 5000000,
        directCosts: 1000000,
        operatingExpenses: 2000000
      };

      const result = calculateProfitLoss(input);

      expect(result.totalRevenue).toBe(5000000);
      expect(result.directCosts).toBe(1000000);
      expect(result.grossProfit).toBe(4000000);
      expect(result.operatingExpenses).toBe(2000000);
      expect(result.operatingProfit).toBe(2000000);
      expect(result.netProfit).toBe(2000000);
      expect(result.grossProfitMargin).toBe(80);
      expect(result.netProfitMargin).toBe(40);
      expect(result.status).toBe('PROFIT');
    });

    it('should calculate P&L for loss scenario', () => {
      const input = {
        totalRevenue: 2000000,
        directCosts: 1500000,
        operatingExpenses: 3000000
      };

      const result = calculateProfitLoss(input);

      expect(result.netProfit).toBe(-2500000);
      expect(result.status).toBe('LOSS');
    });

    it('should calculate P&L for break even scenario', () => {
      const input = {
        totalRevenue: 3000000,
        directCosts: 1000000,
        operatingExpenses: 2000000
      };

      const result = calculateProfitLoss(input);

      expect(result.netProfit).toBe(0);
      expect(result.status).toBe('BREAK_EVEN');
    });

    it('should handle zero revenue', () => {
      const input = {
        totalRevenue: 0,
        directCosts: 1000000,
        operatingExpenses: 2000000
      };

      const result = calculateProfitLoss(input);

      expect(result.netProfit).toBe(-3000000);
      expect(result.grossProfitMargin).toBe('N/A');
      expect(result.netProfitMargin).toBe('N/A');
      expect(result.status).toBe('LOSS');
    });
  });
});
