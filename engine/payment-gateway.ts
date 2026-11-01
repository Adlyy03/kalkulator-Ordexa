/**
 * Payment gateway cost calculation engine
 * Handles MDR percentage, fixed fees per transaction
 */

export interface GatewayConfig {
  name: string;
  mdrPercentage: number; // e.g., 2.9 for 2.9%
  fixedFeePerTransaction: number;
  paymentMethod: string;
}

export interface GatewayCalculationInput {
  totalTransactions: number;
  averageTransactionValue: number;
  successRate: number; // 0-1 (e.g., 0.95 for 95%)
  config: GatewayConfig;
}

export interface GatewayResult {
  successfulTransactions: number;
  failedTransactions: number;
  grossTransactionVolume: number;
  percentageFee: number;
  fixedFee: number;
  totalGatewayFee: number;
  effectiveFeeRate: number | 'N/A';
}

/**
 * Calculate successful transactions
 */
export function calculateSuccessfulTransactions(
  totalTransactions: number,
  successRate: number
): number {
  return Math.floor(totalTransactions * successRate);
}

/**
 * Calculate GTV (Gross Transaction Volume)
 */
export function calculateGTV(
  successfulTransactions: number,
  averageTransactionValue: number
): number {
  return successfulTransactions * averageTransactionValue;
}

/**
 * Calculate percentage-based fee (MDR)
 */
export function calculatePercentageFee(gtv: number, mdrPercentage: number): number {
  return (gtv * mdrPercentage) / 100;
}

/**
 * Calculate fixed fee
 */
export function calculateFixedFee(
  successfulTransactions: number,
  fixedFeePerTransaction: number
): number {
  return successfulTransactions * fixedFeePerTransaction;
}

/**
 * Calculate total gateway fee
 */
export function calculateTotalGatewayFee(
  percentageFee: number,
  fixedFee: number,
  additionalFees: number = 0
): number {
  return percentageFee + fixedFee + additionalFees;
}

/**
 * Calculate effective fee rate (percentage of GTV)
 */
export function calculateEffectiveFeeRate(
  totalFee: number,
  gtv: number
): number | 'N/A' {
  if (gtv === 0) return 'N/A';
  return (totalFee / gtv) * 100;
}

/**
 * Main payment gateway calculation
 */
export function calculatePaymentGateway(input: GatewayCalculationInput): GatewayResult {
  const successfulTransactions = calculateSuccessfulTransactions(
    input.totalTransactions,
    input.successRate
  );
  const failedTransactions = input.totalTransactions - successfulTransactions;
  
  const gtv = calculateGTV(successfulTransactions, input.averageTransactionValue);
  const percentageFee = calculatePercentageFee(gtv, input.config.mdrPercentage);
  const fixedFee = calculateFixedFee(successfulTransactions, input.config.fixedFeePerTransaction);
  const totalGatewayFee = calculateTotalGatewayFee(percentageFee, fixedFee);
  const effectiveFeeRate = calculateEffectiveFeeRate(totalGatewayFee, gtv);
  
  return {
    successfulTransactions,
    failedTransactions,
    grossTransactionVolume: gtv,
    percentageFee,
    fixedFee,
    totalGatewayFee,
    effectiveFeeRate
  };
}
