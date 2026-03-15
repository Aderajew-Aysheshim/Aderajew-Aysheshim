const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const updates = [
  {
    title: 'Introduction to Calculus',
    // Original: WSLO4FhgqdI (Broken) -> New: WuMDAP0aqM8 (Intro to Calculus)
    newUrl: 'https://www.youtube.com/watch?v=WuMDAP0aqM8'
  },
  {
    title: 'Advanced Engineering Math',
    // Original: XFDM1ip5HCI (Broken) -> New: 4R3W4J00JjI (Advanced Engineering Mathematics)
    newUrl: 'https://www.youtube.com/watch?v=4R3W4J00JjI'
  }
];

async function fixVideoURLs() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'tutorhub_db'
    });
    console.log('Connected.');

    for (const update of updates) {
      console.log(`Updating "${update.title}"...`);
      const [result] = await connection.execute(
        'UPDATE resources SET file_url = ?, file_path = ? WHERE title = ? AND type = "video"',
        [update.newUrl, update.newUrl, update.title]
      );

      if (result.affectedRows > 0) {
        console.log(`✅ Updated successfully.`);
      } else {
        console.log(`⚠️ Video not found or already updated.`);
      }
    }

    console.log('\nAll video URLs updated.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

fixVideoURLs();
