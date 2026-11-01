import { getDatabase } from '../client';

export interface CapitalInvestment {
  id?: number;
  item_name: string;
  category: string;
  amount: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const capitalRepository = {
  async getAll(): Promise<CapitalInvestment[]> {
    const db = await getDatabase();
    return await db.getAllAsync<CapitalInvestment>(
      'SELECT * FROM capital_investments ORDER BY created_at DESC'
    );
  },

  async getById(id: number): Promise<CapitalInvestment | null> {
    const db = await getDatabase();
    return await db.getFirstAsync<CapitalInvestment>(
      'SELECT * FROM capital_investments WHERE id = ?',
      id
    );
  },

  async create(item: CapitalInvestment): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      `INSERT INTO capital_investments (item_name, category, amount, notes)
       VALUES (?, ?, ?, ?)`,
      item.item_name,
      item.category,
      item.amount,
      item.notes || null
    );
    return result.lastInsertRowId;
  },

  async update(id: number, item: Partial<CapitalInvestment>): Promise<void> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (item.item_name !== undefined) {
      fields.push('item_name = ?');
      values.push(item.item_name);
    }
    if (item.category !== undefined) {
      fields.push('category = ?');
      values.push(item.category);
    }
    if (item.amount !== undefined) {
      fields.push('amount = ?');
      values.push(item.amount);
    }
    if (item.notes !== undefined) {
      fields.push('notes = ?');
      values.push(item.notes);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await db.runAsync(
      `UPDATE capital_investments SET ${fields.join(', ')} WHERE id = ?`,
      ...values
    );
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM capital_investments WHERE id = ?', id);
  },
};
