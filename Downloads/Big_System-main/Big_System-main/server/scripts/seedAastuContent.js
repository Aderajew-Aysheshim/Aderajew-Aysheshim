const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const resources = [
  {
    title: 'Logic and Critical Thinking - Final Exam 2015',
    description: 'Past exam for Phil 1009.',
    type: 'exam',
    subject: 'Logic and Critical Thinking',
    grade_level: 'Freshman',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/IntroductionToLogic.pdf', // Placeholder
    tags: 'aastu, freshman, exam, logic, phil 1009',
    access_level: 'free'
  },
  {
    title: 'Geography of Ethiopia and the Horn - Midterm',
    description: 'GeEs 1005 study guide and questions.',
    type: 'material',
    subject: 'Geography',
    grade_level: 'Freshman',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/WorldGeography.pdf', // Placeholder
    tags: 'aastu, freshman, paper, geography, gees 1005',
    access_level: 'free'
  },
  {
    title: 'Communicative English Language Skills I - Final',
    description: 'FLEn 1003 Final Paper.',
    type: 'exam',
    subject: 'English',
    grade_level: 'Freshman',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/WritingGuide.pdf', // Placeholder
    tags: 'aastu, freshman, exam, english, flen 1003',
    access_level: 'free'
  },
  {
    title: 'Mathematics for Natural Science - Practice Problems',
    description: 'Math 1007 practice set.',
    type: 'material',
    subject: 'Mathematics',
    grade_level: 'Freshman',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVolume1-OP.pdf',
    tags: 'aastu, freshman, paper, math, math 1007',
    access_level: 'free'
  },
  {
    title: 'General Psychology - Chapter Summary',
    description: 'Psyc 1011 summary notes.',
    type: 'material',
    subject: 'Psychology',
    grade_level: 'Freshman',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/Psychology2e-OP.pdf',
    tags: 'aastu, freshman, paper, psychology, psyc 1011',
    access_level: 'free'
  },
  {
    title: 'Entrepreneurship for Engineers - Project Guide',
    description: 'Entr 1106 project guidelines.',
    type: 'material',
    subject: 'Entrepreneurship',
    grade_level: 'Freshman',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/Entrepreneurship-OP.pdf',
    tags: 'aastu, freshman, paper, entrepreneurship, entr 1106',
    access_level: 'free'
  },
  {
    title: 'General Physics - Lab Report Template',
    description: 'Phys 1001 Lab Report format.',
    type: 'material',
    subject: 'Physics',
    grade_level: 'Freshman',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVolume1-OP.pdf',
    tags: 'aastu, freshman, paper, physics, phys 1001',
    access_level: 'free'
  },
  {
    title: 'Social Anthropology - Field Notes',
    description: 'Anth 1002 reading material.',
    type: 'material',
    subject: 'Anthropology',
    grade_level: 'Freshman',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/IntroductionToAnthropology.pdf', // Placeholder
    tags: 'aastu, freshman, paper, anthropology, anth 1002',
    access_level: 'free'
  },
  {
    title: 'Physical Fitness - Training Log',
    description: 'SpSc 1013 activity log.',
    type: 'material',
    subject: 'Physical Fitness',
    grade_level: 'Freshman',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/FitnessGuide.pdf', // Placeholder
    tags: 'aastu, freshman, paper, fitness, spsc 1013',
    access_level: 'free'
  }
];

async function seedAastuContent() {
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

    // Optional: Clear previous AASTU content to avoid duplicates if re-running
    // await connection.execute("DELETE FROM resources WHERE tags LIKE '%aastu%'");

    const sql = `
      INSERT INTO resources 
      (title, description, type, subject, grade_level, file_url, file_path, file_name, access_level, 
       tags, file_type, file_size, status, uploader_type, uploaded_by, language, year, semester)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pdf', 1024, 'approved', 'admin', 1, 'English', '2025', '1')
    `;

    for (const r of resources) {
      // Check duplicate before inserting
      const [rows] = await connection.execute('SELECT id FROM resources WHERE title = ?', [r.title]);
      if (rows.length === 0) {
        await connection.execute(sql, [
          r.title,
          r.description,
          r.type,
          r.subject,
          r.grade_level,
          r.file_url,
          r.file_url,
          r.title.replace(/ /g, '_') + '.pdf',
          r.access_level,
          r.tags
        ]);
        console.log(`Added: ${r.title}`);
      } else {
        console.log(`Skipped (Exists): ${r.title}`);
      }
    }

    console.log('✅ AASTU Freshman content updated successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

seedAastuContent();
