import { create } from 'zustand';
import { calculateRevenue, type Package } from '../engine/revenue';
import { calculateProfitLoss, type ProfitLossResult } from '../engine/profit-loss';
import { calculateBreakEven, type BreakEvenResult } from '../engine/break-even';
import { calculateRoi, type RoiCalculatorResult, type CapexItem } from '../engine/roi-calculator';
import { initializeDatabase, packageRepository, expenseRepository, capitalRepository } from '../db';
import type { Expense } from '../db/repositories/expenses';
import type { CapitalInvestment } from '../db/repositories/capital';

export interface FinancialStoreState {
  isInitialized: boolean;
  isLoading: boolean;

  // Revenue & Packages
  packages: Package[];
  otherRevenue: number;

  // Expenses
  fixedCosts: number;
  variableCostPerResto: number;
  expenseList: Expense[];

  // Capital Investments / Modal Awal (Capex)
  capitalInvestments: CapitalInvestment[];

  // Actions
  initialize: () => Promise<void>;
  updatePackageCount: (index: number, count: number) => void;
  updatePackagePrice: (index: number, price: number) => void;
  addPackage: (name: string, monthlyPrice: number) => void;
  deletePackage: (index: number) => void;

  setOtherRevenue: (amount: number) => void;
  setFixedCosts: (amount: number) => void;
  setVariableCostPerResto: (amount: number) => void;

  // CRUD Expenses
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;

  // CRUD Capital Investments (Modal Awal)
  addCapitalInvestment: (item: Omit<CapitalInvestment, 'id'>) => Promise<void>;
  updateCapitalInvestment: (id: number, item: Partial<CapitalInvestment>) => Promise<void>;
  deleteCapitalInvestment: (id: number) => Promise<void>;

  resetToDefaults: () => Promise<void>;

  // Computed summary
  getFinancialSummary: () => {
    totalActiveRestaurants: number;
    mrr: number;
    arr: number;
    arpa: number | 'N/A';
    variableCostPerResto: number;
    totalVariableCosts: number;
    totalExpenses: number;
    profitLoss: ProfitLossResult;
    bep: BreakEvenResult;
    totalCapitalInvestment: number;
    roi: RoiCalculatorResult;
  };
}

const DEFAULT_PACKAGES: Package[] = [
  { name: 'Basic', monthlyPrice: 99000, restaurantCount: 0 },
  { name: 'Pro', monthlyPrice: 199000, restaurantCount: 0 },
  { name: 'Enterprise', monthlyPrice: 399000, restaurantCount: 0 },
];

export const useFinancialStore = create<FinancialStoreState>((set, get) => ({
  isInitialized: false,
  isLoading: false,

  packages: DEFAULT_PACKAGES,
  otherRevenue: 0,

  fixedCosts: 0,
  variableCostPerResto: 0,
  expenseList: [],

  capitalInvestments: [],

  initialize: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });

    try {
      await initializeDatabase();

      // Load packages from SQLite
      const dbPackages = await packageRepository.getActive();
      let loadedPackages: Package[] = DEFAULT_PACKAGES;
      if (dbPackages && dbPackages.length > 0) {
        loadedPackages = dbPackages.map((p) => ({
          name: p.package_name,
          monthlyPrice: p.monthly_price,
          restaurantCount: 0,
        }));
      }

      // Load expenses from SQLite
      const dbExpenses = await expenseRepository.getAll();
      let fixed = 0;
      let variable = 0;
      if (dbExpenses && dbExpenses.length > 0) {
        for (const exp of dbExpenses) {
          if (exp.expense_type === 'FIXED') {
            fixed += exp.amount;
          } else if (exp.expense_type === 'VARIABLE') {
            variable += exp.amount;
          }
        }
      }

      // Load capital investments from SQLite
      const dbCapital = await capitalRepository.getAll();

      set({
        packages: loadedPackages,
        expenseList: dbExpenses || [],
        fixedCosts: fixed > 0 ? fixed : get().fixedCosts,
        variableCostPerResto: variable > 0 ? variable : get().variableCostPerResto,
        capitalInvestments: dbCapital || [],
        isInitialized: true,
        isLoading: false,
      });
    } catch (err) {
      console.warn('Store init warning (using offline memory store):', err);
      set({ isInitialized: true, isLoading: false });
    }
  },

  updatePackageCount: (index: number, count: number) => {
    set((state) => {
      const updated = [...state.packages];
      if (updated[index]) {
        updated[index] = { ...updated[index], restaurantCount: Math.max(0, count) };
      }
      return { packages: updated };
    });
  },

  updatePackagePrice: (index: number, price: number) => {
    set((state) => {
      const updated = [...state.packages];
      if (updated[index]) {
        updated[index] = { ...updated[index], monthlyPrice: Math.max(0, price) };
      }
      return { packages: updated };
    });
  },

  addPackage: (name: string, monthlyPrice: number) => {
    set((state) => ({
      packages: [
        ...state.packages,
        { name, monthlyPrice: Math.max(0, monthlyPrice), restaurantCount: 0 },
      ],
    }));
  },

  deletePackage: (index: number) => {
    set((state) => ({
      packages: state.packages.filter((_, i) => i !== index),
    }));
  },

  setOtherRevenue: (amount: number) => {
    set({ otherRevenue: Math.max(0, amount) });
  },

  setFixedCosts: (amount: number) => {
    set({ fixedCosts: Math.max(0, amount) });
  },

  setVariableCostPerResto: (amount: number) => {
    set({ variableCostPerResto: Math.max(0, amount) });
  },

  addExpense: async (expense: Omit<Expense, 'id'>) => {
    try {
      const id = await expenseRepository.create(expense as Expense);
      const newExpense: Expense = { ...expense, id };
      set((state) => {
        const updatedList = [newExpense, ...state.expenseList];
        const newFixed = updatedList
          .filter((e) => e.expense_type === 'FIXED')
          .reduce((sum, e) => sum + e.amount, 0);
        return {
          expenseList: updatedList,
          fixedCosts: newFixed > 0 ? newFixed : state.fixedCosts,
        };
      });
    } catch {
      // Fallback local memory
      const fallbackExpense: Expense = { ...expense, id: Date.now() };
      set((state) => ({
        expenseList: [fallbackExpense, ...state.expenseList],
      }));
    }
  },

  deleteExpense: async (id: number) => {
    try {
      await expenseRepository.delete(id);
    } catch {}
    set((state) => {
      const updatedList = state.expenseList.filter((e) => e.id !== id);
      const newFixed = updatedList
        .filter((e) => e.expense_type === 'FIXED')
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        expenseList: updatedList,
        fixedCosts: newFixed,
      };
    });
  },

  addCapitalInvestment: async (item: Omit<CapitalInvestment, 'id'>) => {
    try {
      const id = await capitalRepository.create(item as CapitalInvestment);
      const newItem: CapitalInvestment = { ...item, id };
      set((state) => ({
        capitalInvestments: [newItem, ...state.capitalInvestments],
      }));
    } catch {
      const fallbackItem: CapitalInvestment = { ...item, id: Date.now() };
      set((state) => ({
        capitalInvestments: [fallbackItem, ...state.capitalInvestments],
      }));
    }
  },

  updateCapitalInvestment: async (id: number, item: Partial<CapitalInvestment>) => {
    try {
      await capitalRepository.update(id, item);
    } catch {}
    set((state) => ({
      capitalInvestments: state.capitalInvestments.map((ci) =>
        ci.id === id ? { ...ci, ...item } : ci
      ),
    }));
  },

  deleteCapitalInvestment: async (id: number) => {
    try {
      await capitalRepository.delete(id);
    } catch {}
    set((state) => ({
      capitalInvestments: state.capitalInvestments.filter((ci) => ci.id !== id),
    }));
  },

  resetToDefaults: async () => {
    set({
      packages: DEFAULT_PACKAGES,
      otherRevenue: 0,
      fixedCosts: 0,
      variableCostPerResto: 0,
      expenseList: [],
      capitalInvestments: [],
    });
  },

  getFinancialSummary: () => {
    const { packages, otherRevenue, fixedCosts, variableCostPerResto, capitalInvestments } = get();

    const revenueResult = calculateRevenue(packages, otherRevenue);
    const totalActive = revenueResult.totalRestaurants;
    const totalVariableCosts = totalActive * variableCostPerResto;
    const totalExpenses = fixedCosts + totalVariableCosts;

    const profitLoss = calculateProfitLoss({
      totalRevenue: revenueResult.totalMRR,
      directCosts: totalVariableCosts,
      operatingExpenses: fixedCosts,
    });

    const avgPrice = totalActive > 0 ? revenueResult.totalMRR / totalActive : 199000;
    const bep = calculateBreakEven({
      fixedCost: fixedCosts,
      arpa: avgPrice,
      variableCostPerRestaurant: variableCostPerResto,
    });

    const capexItems: CapexItem[] = capitalInvestments.map((ci) => ({
      id: ci.id,
      name: ci.item_name,
      category: ci.category,
      amount: ci.amount,
      notes: ci.notes,
    }));

    const totalCapitalInvestment = capexItems.reduce((sum, i) => sum + i.amount, 0);

    const roi = calculateRoi({
      capexItems,
      monthlyNetProfit: profitLoss.netProfit,
      projectionMonths: 24,
    });

    return {
      totalActiveRestaurants: totalActive,
      mrr: revenueResult.totalMRR,
      arr: revenueResult.totalARR,
      arpa: revenueResult.arpa,
      variableCostPerResto,
      totalVariableCosts,
      totalExpenses,
      profitLoss,
      bep,
      totalCapitalInvestment,
      roi,
    };
  },
}));
