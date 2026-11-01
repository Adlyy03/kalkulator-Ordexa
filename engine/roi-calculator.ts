import { safeDivide, roundTo } from './math';

export interface CapexItem {
  id?: string | number;
  name: string;
  category: string;
  amount: number;
  notes?: string;
}

export interface RoiCalculatorInput {
  capexItems: CapexItem[];
  monthlyNetProfit: number;
  projectionMonths?: number; // default 24
}

export interface MonthPaybackSchedule {
  month: number;
  monthlyNetProfit: number;
  cumulativeCashInflow: number;
  remainingCapitalToRecover: number;
  isRecovered: boolean;
}

export interface RoiCalculatorResult {
  totalInitialInvestment: number;
  monthlyNetProfit: number;
  paybackPeriodMonths: number | 'N/A';
  oneYearRoiPercentage: number | 'N/A';
  twoYearRoiPercentage: number | 'N/A';
  recoveryStatus: 'RECOVERED' | 'IN_PROGRESS' | 'UNRECOVERABLE';
  schedule: MonthPaybackSchedule[];
}

/**
 * Calculates Initial Capital Investment, Payback Period, and Return on Investment (ROI).
 * Adheres to PRD Section 13.
 */
export function calculateRoi(input: RoiCalculatorInput): RoiCalculatorResult {
  const { capexItems, monthlyNetProfit, projectionMonths = 24 } = input;

  const totalInitialInvestment = capexItems.reduce(
    (sum, item) => sum + Math.max(0, item.amount || 0),
    0
  );

  let paybackPeriodMonths: number | 'N/A' = 'N/A';
  let recoveryStatus: 'RECOVERED' | 'IN_PROGRESS' | 'UNRECOVERABLE' = 'UNRECOVERABLE';

  if (totalInitialInvestment === 0) {
    paybackPeriodMonths = 0;
    recoveryStatus = 'RECOVERED';
  } else if (monthlyNetProfit > 0) {
    // Payback period in months = Initial Investment / Monthly Net Profit
    paybackPeriodMonths = roundTo(totalInitialInvestment / monthlyNetProfit, 1);
    recoveryStatus = 'IN_PROGRESS';
  } else {
    recoveryStatus = 'UNRECOVERABLE';
  }

  // 1-Year ROI: (Annual Net Profit / Total Investment) * 100%
  const oneYearProfit = monthlyNetProfit * 12;
  const twoYearProfit = monthlyNetProfit * 24;

  const oneYearRoiPercentage =
    totalInitialInvestment > 0
      ? roundTo((oneYearProfit / totalInitialInvestment) * 100, 1)
      : 'N/A';

  const twoYearRoiPercentage =
    totalInitialInvestment > 0
      ? roundTo((twoYearProfit / totalInitialInvestment) * 100, 1)
      : 'N/A';

  // Build schedule
  const schedule: MonthPaybackSchedule[] = [];
  let cumulative = 0;

  for (let m = 1; m <= projectionMonths; m++) {
    cumulative += monthlyNetProfit;
    const remaining = Math.max(0, totalInitialInvestment - cumulative);
    const isRecovered = cumulative >= totalInitialInvestment && totalInitialInvestment > 0;

    if (isRecovered && recoveryStatus === 'IN_PROGRESS') {
      // It recovers within the projection window
    }

    schedule.push({
      month: m,
      monthlyNetProfit,
      cumulativeCashInflow: cumulative,
      remainingCapitalToRecover: remaining,
      isRecovered,
    });
  }

  if (
    typeof paybackPeriodMonths === 'number' &&
    paybackPeriodMonths > 0 &&
    paybackPeriodMonths <= projectionMonths
  ) {
    recoveryStatus = cumulative >= totalInitialInvestment ? 'RECOVERED' : 'IN_PROGRESS';
  }

  return {
    totalInitialInvestment,
    monthlyNetProfit,
    paybackPeriodMonths,
    oneYearRoiPercentage,
    twoYearRoiPercentage,
    recoveryStatus,
    schedule,
  };
}
