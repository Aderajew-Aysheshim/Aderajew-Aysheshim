const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function updateSchema() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'tutorhub_db',
      multipleStatements: true
    });
    console.log('Connected.');

    // Add missing columns
    const alterQueries = [
      "ALTER TABLE resources ADD COLUMN type VARCHAR(50) DEFAULT 'other'",
      "ALTER TABLE resources ADD COLUMN subject VARCHAR(100)",
      "ALTER TABLE resources ADD COLUMN grade_level VARCHAR(50)",
      "ALTER TABLE resources ADD COLUMN course_code VARCHAR(50)",
      "ALTER TABLE resources ADD COLUMN access_level ENUM('free', 'premium') DEFAULT 'free'",
      "ALTER TABLE resources ADD COLUMN file_url VARCHAR(255)",
      "ALTER TABLE resources ADD COLUMN file_type VARCHAR(20)",
      "ALTER TABLE resources ADD COLUMN file_size INT",
      "ALTER TABLE resources ADD COLUMN tags TEXT",
      "ALTER TABLE resources ADD COLUMN year VARCHAR(10)",
      "ALTER TABLE resources ADD COLUMN semester VARCHAR(10)",
      "ALTER TABLE resources ADD COLUMN language VARCHAR(50) DEFAULT 'English'",
      "ALTER TABLE resources ADD COLUMN uploader_type ENUM('student', 'tutor', 'admin') DEFAULT 'admin'",
      "ALTER TABLE resources ADD COLUMN views INT DEFAULT 0",
      "ALTER TABLE resources ADD COLUMN downloads INT DEFAULT 0",
      "ALTER TABLE resources ADD COLUMN rating DECIMAL(3,2) DEFAULT 0",
      "ALTER TABLE resources ADD COLUMN total_ratings INT DEFAULT 0"
    ];

    for (const query of alterQueries) {
      try {
        await connection.query(query);
        console.log(`Executed: ${query}`);
      } catch (err) {
        // Ignore duplicate column errors or handle specific codes if needed
        console.log(`Skipped/Error: ${err.message}`);
      }
    }

    // Also ensuring fulltext index exists for search
    try {
      await connection.query("CREATE FULLTEXT INDEX idx_search ON resources(title, description, tags)");
      console.log("Fulltext index created");
    } catch (err) {
      console.log("Fulltext index might already exist or failed: " + err.message);
    }

    console.log('Schema update complete.');

  } catch (error) {
    console.error('Update error:', error);
  } finally {
    if (connection) await connection.end();
  }
}

updateSchema();
