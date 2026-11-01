import { getDatabase } from '../client';

export interface ExpenseCategory {
  id?: number;
  category_name: string;
  category_type: string;
}

export interface Expense {
  id?: number;
  expense_name: string;
  category_id: number;
  amount: number;
  expense_type: string;
  frequency: string;
  effective_date?: string;
  created_at?: string;
  updated_at?: string;
}

export const expenseRepository = {
  async getAllCategories(): Promise<ExpenseCategory[]> {
    const db = await getDatabase();
    return await db.getAllAsync<ExpenseCategory>('SELECT * FROM expense_categories');
  },

  async getAll(): Promise<Expense[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Expense>('SELECT * FROM expenses ORDER BY created_at DESC');
  },

  async getById(id: number): Promise<Expense | null> {
    const db = await getDatabase();
    return await db.getFirstAsync<Expense>('SELECT * FROM expenses WHERE id = ?', id);
  },

  async create(expense: Expense): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      `INSERT INTO expenses (expense_name, category_id, amount, expense_type, frequency, effective_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      expense.expense_name,
      expense.category_id,
      expense.amount,
      expense.expense_type,
      expense.frequency,
      expense.effective_date || null
    );
    return result.lastInsertRowId;
  },

  async update(id: number, expense: Partial<Expense>): Promise<void> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    
    if (expense.expense_name !== undefined) { fields.push('expense_name = ?'); values.push(expense.expense_name); }
    if (expense.category_id !== undefined) { fields.push('category_id = ?'); values.push(expense.category_id); }
    if (expense.amount !== undefined) { fields.push('amount = ?'); values.push(expense.amount); }
    if (expense.expense_type !== undefined) { fields.push('expense_type = ?'); values.push(expense.expense_type); }
    if (expense.frequency !== undefined) { fields.push('frequency = ?'); values.push(expense.frequency); }
    if (expense.effective_date !== undefined) { fields.push('effective_date = ?'); values.push(expense.effective_date); }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    await db.runAsync(
      `UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`,
      ...values
    );
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM expenses WHERE id = ?', id);
  }
};
