const { query } = require('../config/mysqlDatabase');

async function checkInfrastructure() {
  try {
    const tables = await query('SHOW TABLES');
    console.log('Tables in DB:', tables);

    // Check system_settings
    try {
      const settings = await query('SELECT * FROM system_settings');
      console.log('system_settings content:', settings);
    } catch (e) {
      console.log('system_settings table error:', e.message);
      console.log('Creating system_settings table...');
      await query(`
        CREATE TABLE IF NOT EXISTS system_settings (
          setting_key VARCHAR(50) PRIMARY KEY,
          setting_value VARCHAR(255) NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      await query("INSERT INTO system_settings (setting_key, setting_value) VALUES ('publicRegistration', 'true'), ('maintenanceMode', 'false')");
      console.log('Created system_settings table.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkInfrastructure();
