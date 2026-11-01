import { calculateRoi } from '../../engine/roi-calculator';

describe('ROI & Capex Calculator Engine', () => {
  it('correctly aggregates capex and calculates payback period', () => {
    const items = [
      { name: 'Laptop Dev', category: 'Hardware', amount: 15000000 },
      { name: 'Legal PT', category: 'Legalitas', amount: 5000000 },
      { name: 'Promosi Launching', category: 'Marketing', amount: 10000000 },
    ];
    // Total Capex = 30,000,000. Monthly profit = 5,000,000.
    // Payback period = 30,000,000 / 5,000,000 = 6 months.
    const result = calculateRoi({
      capexItems: items,
      monthlyNetProfit: 5000000,
      projectionMonths: 12,
    });

    expect(result.totalInitialInvestment).toBe(30000000);
    expect(result.paybackPeriodMonths).toBe(6);
    expect(result.recoveryStatus).toBe('RECOVERED');
    expect(result.oneYearRoiPercentage).toBe(200); // (60M / 30M) * 100%
  });

  it('handles negative or zero profit gracefully', () => {
    const items = [{ name: 'Server Awal', category: 'Infrastruktur', amount: 10000000 }];
    const result = calculateRoi({
      capexItems: items,
      monthlyNetProfit: -1000000, // Losing money
      projectionMonths: 12,
    });

    expect(result.totalInitialInvestment).toBe(10000000);
    expect(result.paybackPeriodMonths).toBe('N/A');
    expect(result.recoveryStatus).toBe('UNRECOVERABLE');
  });

  it('handles zero initial investment', () => {
    const result = calculateRoi({
      capexItems: [],
      monthlyNetProfit: 2000000,
    });

    expect(result.totalInitialInvestment).toBe(0);
    expect(result.paybackPeriodMonths).toBe(0);
    expect(result.recoveryStatus).toBe('RECOVERED');
  });
});
