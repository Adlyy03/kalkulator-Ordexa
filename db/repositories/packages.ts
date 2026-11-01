import { getDatabase } from '../client';
import type { SubscriptionPackage } from '../seed';

export interface Package extends SubscriptionPackage {
  id: number;
  created_at: string;
  updated_at: string;
}

export const packageRepository = {
  async getAll(): Promise<Package[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Package>('SELECT * FROM subscription_packages ORDER BY monthly_price ASC');
  },

  async getById(id: number): Promise<Package | null> {
    const db = await getDatabase();
    return await db.getFirstAsync<Package>('SELECT * FROM subscription_packages WHERE id = ?', id);
  },

  async getActive(): Promise<Package[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Package>('SELECT * FROM subscription_packages WHERE is_active = 1 ORDER BY monthly_price ASC');
  },

  async create(pkg: SubscriptionPackage): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      `INSERT INTO subscription_packages (package_name, monthly_price, annual_price, is_active) 
       VALUES (?, ?, ?, ?)`,
      pkg.package_name, pkg.monthly_price, pkg.annual_price || null, pkg.is_active
    );
    return result.lastInsertRowId;
  },

  async update(id: number, pkg: Partial<SubscriptionPackage>): Promise<void> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    
    if (pkg.package_name !== undefined) { fields.push('package_name = ?'); values.push(pkg.package_name); }
    if (pkg.monthly_price !== undefined) { fields.push('monthly_price = ?'); values.push(pkg.monthly_price); }
    if (pkg.annual_price !== undefined) { fields.push('annual_price = ?'); values.push(pkg.annual_price); }
    if (pkg.is_active !== undefined) { fields.push('is_active = ?'); values.push(pkg.is_active); }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    await db.runAsync(
      `UPDATE subscription_packages SET ${fields.join(', ')} WHERE id = ?`,
      ...values
    );
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM subscription_packages WHERE id = ?', id);
  }
};
