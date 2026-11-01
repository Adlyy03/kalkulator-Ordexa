import { runMigrations, seedDatabase, getDatabase } from './client';

/**
 * Initialize database: run migrations and seed data
 * Call this once when app starts
 */
export async function initializeDatabase(): Promise<void> {
  try {
    await runMigrations();
    await seedDatabase();
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export { getDatabase } from './client';
export { packageRepository } from './repositories/packages';
export { expenseRepository } from './repositories/expenses';
export { restaurantRepository } from './repositories/restaurants';
export { capitalRepository } from './repositories/capital';
