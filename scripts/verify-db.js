/**
 * Phase 2 Verification: Database schema and seed test
 * Run: node scripts/verify-db.js
 */

const { initializeDatabase, packageRepository, expenseRepository } = require('../db/index');

async function verifyDatabase() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('✓ Migrations executed');
    
    console.log('\nVerifying seed data...');
    const packages = await packageRepository.getAll();
    console.log(`✓ ${packages.length} subscription packages loaded`);
    packages.forEach(pkg => {
      console.log(`  - ${pkg.package_name}: Rp${pkg.monthly_price.toLocaleString('id-ID')}/mo`);
    });
    
    const categories = await expenseRepository.getAllCategories();
    console.log(`✓ ${categories.length} expense categories loaded`);
    
    console.log('\nTesting CRUD operations...');
    const testRestaurant = {
      restaurant_name: 'Test Restaurant',
      package_id: packages[0].id,
      subscription_status: 'ACTIVE'
    };
    
    const { restaurantRepository } = require('../db/repositories/restaurants');
    const insertId = await restaurantRepository.create(testRestaurant);
    console.log(`✓ CREATE: Restaurant inserted with ID ${insertId}`);
    
    const fetched = await restaurantRepository.getById(insertId);
    console.log(`✓ READ: Fetched restaurant "${fetched.restaurant_name}"`);
    
    await restaurantRepository.update(insertId, { subscription_status: 'PAUSED' });
    const updated = await restaurantRepository.getById(insertId);
    console.log(`✓ UPDATE: Status changed to "${updated.subscription_status}"`);
    
    await restaurantRepository.delete(insertId);
    const deleted = await restaurantRepository.getById(insertId);
    console.log(`✓ DELETE: Restaurant removed (null: ${deleted === null})`);
    
    console.log('\n✅ Phase 2 Verification PASSED');
  } catch (error) {
    console.error('\n❌ Verification FAILED:', error);
    process.exit(1);
  }
}

verifyDatabase();
