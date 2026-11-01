/**
 * Core math utilities for decimal-safe financial calculations
 */

/**
 * Safe division with N/A fallback for zero division
 */
export function safeDivide(numerator: number, denominator: number): number | 'N/A' {
  if (denominator === 0) return 'N/A';
  return numerator / denominator;
}

/**
 * Format number as Indonesian Rupiah
 * Example: 12500000 → "Rp12.500.000"
 */
export function formatIDR(amount: number): string {
  const rounded = Math.round(amount);
  return `Rp${rounded.toLocaleString('id-ID')}`;
}

/**
 * Round to specified decimal places (for display only)
 */
export function roundTo(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Percentage calculation with safe division
 */
export function percentage(part: number, whole: number): number | 'N/A' {
  if (whole === 0) return 'N/A';
  return (part / whole) * 100;
}

/**
 * Parse IDR string to number
 */
export function parseIDR(idrString: string): number {
  // Remove "Rp" and thousand separators (.), keep only digits and decimal comma if any
  const cleaned = idrString.replace(/Rp/g, '').replace(/\./g, '').replace(/,/g, '.');
  return parseFloat(cleaned) || 0;
}
