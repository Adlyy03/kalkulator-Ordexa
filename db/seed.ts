import { getDatabase } from './client';

export interface SubscriptionPackage {
  id?: number;
  package_name: string;
  monthly_price: number;
  annual_price?: number;
  is_active: number;
}

export async function seedDefaultPackages(): Promise<void> {
  const db = await getDatabase();
  
  const packages = [
    { package_name: 'Basic', monthly_price: 99000, annual_price: 1188000, is_active: 1 },
    { package_name: 'Pro', monthly_price: 199000, annual_price: 2388000, is_active: 1 },
    { package_name: 'Enterprise', monthly_price: 399000, annual_price: 4788000, is_active: 1 }
  ];
  
  for (const pkg of packages) {
    const existing = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM subscription_packages WHERE package_name = ?',
      pkg.package_name
    );
    
    if (existing && existing.count === 0) {
      await db.runAsync(
        `INSERT INTO subscription_packages (package_name, monthly_price, annual_price, is_active) 
         VALUES (?, ?, ?, ?)`,
        pkg.package_name, pkg.monthly_price, pkg.annual_price, pkg.is_active
      );
    }
  }
}

export async function seedDefaultCategories(): Promise<void> {
  const db = await getDatabase();
  
  const categories = [
    { category_name: 'Infrastructure', category_type: 'FIXED' },
    { category_name: 'Development', category_type: 'VARIABLE' },
    { category_name: 'Marketing', category_type: 'VARIABLE' },
    { category_name: 'Operations', category_type: 'FIXED' },
    { category_name: 'Payment Gateway', category_type: 'VARIABLE' },
    { category_name: 'Other', category_type: 'VARIABLE' }
  ];
  
  for (const cat of categories) {
    const existing = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM expense_categories WHERE category_name = ?',
      cat.category_name
    );
    
    if (existing && existing.count === 0) {
      await db.runAsync(
        'INSERT INTO expense_categories (category_name, category_type) VALUES (?, ?)',
        cat.category_name, cat.category_type
      );
    }
  }
}

export async function seedDatabase(): Promise<void> {
  await seedDefaultPackages();
  await seedDefaultCategories();
}
