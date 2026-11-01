import {
  calculateSuccessfulTransactions,
  calculateGTV,
  calculatePercentageFee,
  calculateFixedFee,
  calculateTotalGatewayFee,
  calculateEffectiveFeeRate,
  calculatePaymentGateway,
  type GatewayCalculationInput
} from '../../engine/payment-gateway';

describe('Payment Gateway Engine', () => {
  describe('calculateSuccessfulTransactions', () => {
    it('should calculate successful transactions', () => {
      expect(calculateSuccessfulTransactions(100, 0.95)).toBe(95);
      expect(calculateSuccessfulTransactions(200, 0.98)).toBe(196);
    });

    it('should floor the result', () => {
      expect(calculateSuccessfulTransactions(100, 0.957)).toBe(95);
    });

    it('should handle 100% success rate', () => {
      expect(calculateSuccessfulTransactions(100, 1.0)).toBe(100);
    });

    it('should handle 0% success rate', () => {
      expect(calculateSuccessfulTransactions(100, 0)).toBe(0);
    });
  });

  describe('calculateGTV', () => {
    it('should calculate gross transaction volume', () => {
      expect(calculateGTV(95, 50000)).toBe(4750000);
      expect(calculateGTV(100, 100000)).toBe(10000000);
    });

    it('should handle zero transactions', () => {
      expect(calculateGTV(0, 50000)).toBe(0);
    });
  });

  describe('calculatePercentageFee', () => {
    it('should calculate MDR percentage fee', () => {
      expect(calculatePercentageFee(10000000, 2.9)).toBe(290000);
      expect(calculatePercentageFee(5000000, 1.5)).toBe(75000);
    });

    it('should handle zero GTV', () => {
      expect(calculatePercentageFee(0, 2.9)).toBe(0);
    });
  });

  describe('calculateFixedFee', () => {
    it('should calculate fixed fee per transaction', () => {
      expect(calculateFixedFee(95, 2000)).toBe(190000);
      expect(calculateFixedFee(100, 1500)).toBe(150000);
    });

    it('should handle zero transactions', () => {
      expect(calculateFixedFee(0, 2000)).toBe(0);
    });
  });

  describe('calculateTotalGatewayFee', () => {
    it('should sum percentage and fixed fees', () => {
      expect(calculateTotalGatewayFee(290000, 190000)).toBe(480000);
    });

    it('should include additional fees', () => {
      expect(calculateTotalGatewayFee(290000, 190000, 50000)).toBe(530000);
    });
  });

  describe('calculateEffectiveFeeRate', () => {
    it('should calculate effective fee rate percentage', () => {
      expect(calculateEffectiveFeeRate(480000, 10000000)).toBe(4.8);
    });

    it('should return N/A for zero GTV', () => {
      expect(calculateEffectiveFeeRate(100000, 0)).toBe('N/A');
    });
  });

  describe('calculatePaymentGateway (full)', () => {
    it('should calculate complete gateway metrics', () => {
      const input: GatewayCalculationInput = {
        totalTransactions: 100,
        averageTransactionValue: 50000,
        successRate: 0.95,
        config: {
          name: 'Midtrans',
          mdrPercentage: 2.9,
          fixedFeePerTransaction: 2000,
          paymentMethod: 'QRIS'
        }
      };

      const result = calculatePaymentGateway(input);

      expect(result.successfulTransactions).toBe(95);
      expect(result.failedTransactions).toBe(5);
      expect(result.grossTransactionVolume).toBe(4750000);
      expect(result.percentageFee).toBe(137750);
      expect(result.fixedFee).toBe(190000);
      expect(result.totalGatewayFee).toBe(327750);
      expect(result.effectiveFeeRate).toBeCloseTo(6.9, 1);
    });

    it('should handle zero transactions', () => {
      const input: GatewayCalculationInput = {
        totalTransactions: 0,
        averageTransactionValue: 50000,
        successRate: 0.95,
        config: {
          name: 'Midtrans',
          mdrPercentage: 2.9,
          fixedFeePerTransaction: 2000,
          paymentMethod: 'QRIS'
        }
      };

      const result = calculatePaymentGateway(input);

      expect(result.successfulTransactions).toBe(0);
      expect(result.grossTransactionVolume).toBe(0);
      expect(result.totalGatewayFee).toBe(0);
      expect(result.effectiveFeeRate).toBe('N/A');
    });
  });
});
