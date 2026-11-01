import { getDatabase } from '../client';

export interface Restaurant {
  id?: number;
  restaurant_name: string;
  package_id: number;
  subscription_status: string;
  start_date?: string;
  created_at?: string;
  updated_at?: string;
}

export const restaurantRepository = {
  async getAll(): Promise<Restaurant[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Restaurant>('SELECT * FROM restaurants ORDER BY created_at DESC');
  },

  async getById(id: number): Promise<Restaurant | null> {
    const db = await getDatabase();
    return await db.getFirstAsync<Restaurant>('SELECT * FROM restaurants WHERE id = ?', id);
  },

  async getByPackageId(packageId: number): Promise<Restaurant[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Restaurant>('SELECT * FROM restaurants WHERE package_id = ?', packageId);
  },

  async getActive(): Promise<Restaurant[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Restaurant>('SELECT * FROM restaurants WHERE subscription_status = ?', 'ACTIVE');
  },

  async create(restaurant: Restaurant): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      `INSERT INTO restaurants (restaurant_name, package_id, subscription_status, start_date) 
       VALUES (?, ?, ?, ?)`,
      restaurant.restaurant_name,
      restaurant.package_id,
      restaurant.subscription_status || 'ACTIVE',
      restaurant.start_date || new Date().toISOString()
    );
    return result.lastInsertRowId;
  },

  async update(id: number, restaurant: Partial<Restaurant>): Promise<void> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    
    if (restaurant.restaurant_name !== undefined) { fields.push('restaurant_name = ?'); values.push(restaurant.restaurant_name); }
    if (restaurant.package_id !== undefined) { fields.push('package_id = ?'); values.push(restaurant.package_id); }
    if (restaurant.subscription_status !== undefined) { fields.push('subscription_status = ?'); values.push(restaurant.subscription_status); }
    if (restaurant.start_date !== undefined) { fields.push('start_date = ?'); values.push(restaurant.start_date); }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    await db.runAsync(
      `UPDATE restaurants SET ${fields.join(', ')} WHERE id = ?`,
      ...values
    );
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM restaurants WHERE id = ?', id);
  },

  async countByPackage(): Promise<{ package_id: number; count: number }[]> {
    const db = await getDatabase();
    return await db.getAllAsync<{ package_id: number; count: number }>(
      'SELECT package_id, COUNT(*) as count FROM restaurants WHERE subscription_status = ? GROUP BY package_id',
      'ACTIVE'
    );
  }
};
