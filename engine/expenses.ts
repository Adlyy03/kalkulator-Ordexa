/**
 * Expense calculation engine
 * Handles fixed, variable, and operating costs
 */

export type ExpenseType = 'FIXED' | 'VARIABLE' | 'ONE_TIME';
export type ExpenseFrequency = 'MONTHLY' | 'ANNUAL' | 'ONE_TIME';

export interface Expense {
  name: string;
  amount: number;
  type: ExpenseType;
  frequency: ExpenseFrequency;
  categoryId: string;
}

export interface ExpenseResult {
  totalFixedCost: number;
  totalVariableCost: number;
  totalMonthlyExpenses: number;
  totalAnnualExpenses: number;
  expensesByCategory: { [categoryId: string]: number };
}

/**
 * Convert expense to monthly amount
 */
export function toMonthlyAmount(amount: number, frequency: ExpenseFrequency): number {
  switch (frequency) {
    case 'MONTHLY':
      return amount;
    case 'ANNUAL':
      return amount / 12;
    case 'ONE_TIME':
      return 0; // One-time costs not included in recurring monthly
    default:
      return amount;
  }
}

/**
 * Calculate total fixed costs (monthly)
 */
export function calculateFixedCost(expenses: Expense[]): number {
  return expenses
    .filter(e => e.type === 'FIXED')
    .reduce((sum, e) => sum + toMonthlyAmount(e.amount, e.frequency), 0);
}

/**
 * Calculate total variable costs (monthly)
 */
export function calculateVariableCost(expenses: Expense[]): number {
  return expenses
    .filter(e => e.type === 'VARIABLE')
    .reduce((sum, e) => sum + toMonthlyAmount(e.amount, e.frequency), 0);
}

/**
 * Calculate total monthly expenses
 */
export function calculateTotalMonthlyExpenses(expenses: Expense[]): number {
  return expenses
    .filter(e => e.frequency !== 'ONE_TIME')
    .reduce((sum, e) => sum + toMonthlyAmount(e.amount, e.frequency), 0);
}

/**
 * Calculate total annual expenses
 */
export function calculateTotalAnnualExpenses(expenses: Expense[]): number {
  const monthlyTotal = calculateTotalMonthlyExpenses(expenses);
  const oneTimeCosts = expenses
    .filter(e => e.frequency === 'ONE_TIME')
    .reduce((sum, e) => sum + e.amount, 0);
  
  return (monthlyTotal * 12) + oneTimeCosts;
}

/**
 * Group expenses by category
 */
export function groupByCategory(expenses: Expense[]): { [categoryId: string]: number } {
  const grouped: { [key: string]: number } = {};
  
  expenses.forEach(expense => {
    const monthlyAmount = toMonthlyAmount(expense.amount, expense.frequency);
    if (!grouped[expense.categoryId]) {
      grouped[expense.categoryId] = 0;
    }
    grouped[expense.categoryId] += monthlyAmount;
  });
  
  return grouped;
}

/**
 * Main expense calculation
 */
export function calculateExpenses(expenses: Expense[]): ExpenseResult {
  return {
    totalFixedCost: calculateFixedCost(expenses),
    totalVariableCost: calculateVariableCost(expenses),
    totalMonthlyExpenses: calculateTotalMonthlyExpenses(expenses),
    totalAnnualExpenses: calculateTotalAnnualExpenses(expenses),
    expensesByCategory: groupByCategory(expenses)
  };
}
