import * as SQLite from 'expo-sqlite';
import { seedDatabase as runSeed } from './seed';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Get or initialize database connection
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync('ordexa.db');
  return db;
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

/**
 * Execute migration SQL
 */
export async function executeMigration(sql: string): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(sql);
}

/**
 * Run all migrations
 */
export async function runMigrations(): Promise<void> {
  const database = await getDatabase();
  
  // Create migrations table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Check which migrations have run
  const migrations = await database.getAllAsync<{ name: string }>(
    'SELECT name FROM migrations'
  );
  const executed = new Set(migrations.map(m => m.name));
  
  // Define migrations
  const allMigrations = [
    { name: '001_create_business_settings', sql: MIGRATION_001 },
    { name: '002_create_subscription_packages', sql: MIGRATION_002 },
    { name: '003_create_restaurants', sql: MIGRATION_003 },
    { name: '004_create_revenue_records', sql: MIGRATION_004 },
    { name: '005_create_expense_categories', sql: MIGRATION_005 },
    { name: '006_create_expenses', sql: MIGRATION_006 },
    { name: '007_create_payment_gateway_settings', sql: MIGRATION_007 },
    { name: '008_create_simulations', sql: MIGRATION_008 },
    { name: '009_create_financial_snapshots', sql: MIGRATION_009 },
    { name: '010_create_capital_investments', sql: MIGRATION_010 }
  ];
  
  // Run pending migrations
  for (const migration of allMigrations) {
    if (!executed.has(migration.name)) {
      await database.execAsync(migration.sql);
      await database.runAsync(
        'INSERT INTO migrations (name) VALUES (?)',
        migration.name
      );
    }
  }
}

/**
 * Seed default data
 */
export async function seedDatabase(): Promise<void> {
  await runSeed();
}

// Migration SQL definitions
const MIGRATION_001 = `
CREATE TABLE IF NOT EXISTS business_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_name TEXT NOT NULL,
  currency TEXT DEFAULT 'IDR',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO business_settings (business_name, currency) 
SELECT 'ORDEXA', 'IDR' 
WHERE NOT EXISTS (SELECT 1 FROM business_settings);
`;

const MIGRATION_002 = `
CREATE TABLE IF NOT EXISTS subscription_packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  package_name TEXT NOT NULL,
  monthly_price REAL NOT NULL,
  annual_price REAL,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

const MIGRATION_003 = `
CREATE TABLE IF NOT EXISTS restaurants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_name TEXT NOT NULL,
  package_id INTEGER,
  subscription_status TEXT DEFAULT 'ACTIVE',
  start_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (package_id) REFERENCES subscription_packages(id)
);
`;

const MIGRATION_004 = `
CREATE TABLE IF NOT EXISTS revenue_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  period TEXT NOT NULL,
  package_id INTEGER,
  restaurant_count INTEGER DEFAULT 0,
  revenue_amount REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (package_id) REFERENCES subscription_packages(id)
);
`;

const MIGRATION_005 = `
CREATE TABLE IF NOT EXISTS expense_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT NOT NULL,
  category_type TEXT NOT NULL
);
`;

const MIGRATION_006 = `
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expense_name TEXT NOT NULL,
  category_id INTEGER,
  amount REAL NOT NULL,
  expense_type TEXT NOT NULL,
  frequency TEXT NOT NULL,
  effective_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES expense_categories(id)
);
`;

const MIGRATION_007 = `
CREATE TABLE IF NOT EXISTS payment_gateway_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gateway_name TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  percentage_fee REAL NOT NULL,
  fixed_fee REAL NOT NULL,
  fee_bearer TEXT DEFAULT 'ORDEXA',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

const MIGRATION_008 = `
CREATE TABLE IF NOT EXISTS simulations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  simulation_name TEXT NOT NULL,
  scenario_type TEXT,
  simulation_period INTEGER,
  input_data_json TEXT,
  result_data_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

const MIGRATION_009 = `
CREATE TABLE IF NOT EXISTS financial_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  period TEXT NOT NULL,
  revenue REAL DEFAULT 0,
  expenses REAL DEFAULT 0,
  profit REAL DEFAULT 0,
  restaurant_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

const MIGRATION_010 = `
CREATE TABLE IF NOT EXISTS capital_investments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
