const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const videos = [
  {
    title: 'Introduction to Calculus',
    description: 'A complete overview of Limits, Derivatives, and Integrals.',
    type: 'video',
    subject: 'Mathematics',
    grade_level: '12',
    file_url: 'https://www.youtube.com/watch?v=WSLO4FhgqdI',
    access_level: 'free',
    tags: 'calculus, math, derivatives, integrals'
  },
  {
    title: 'Newtons Laws of Motion',
    description: 'Understanding the fundamental laws of physics.',
    type: 'video',
    subject: 'Physics',
    grade_level: '11',
    file_url: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds',
    access_level: 'free',
    tags: 'physics, newton, motion, forces'
  },
  {
    title: 'The Periodic Table Explained',
    description: 'Detailed breakdown of the periodic table groups and periods.',
    type: 'video',
    subject: 'Chemistry',
    grade_level: '10',
    file_url: 'https://www.youtube.com/watch?v=0RRVV4Diomg',
    access_level: 'free',
    tags: 'chemistry, periodic table, elements'
  },
  {
    title: 'Cell Structure and Function',
    description: 'Biology crash course on cell organelles and their functions.',
    type: 'video',
    subject: 'Biology',
    grade_level: '9',
    file_url: 'https://www.youtube.com/watch?v=URUJD5NEXC8',
    access_level: 'free',
    tags: 'biology, cells, science'
  },
  {
    title: 'Intro to Python Programming',
    description: 'Learn the basics of Python: variables, loops, and functions.',
    type: 'video',
    subject: 'Computer Science',
    grade_level: 'University',
    file_url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    access_level: 'free',
    tags: 'python, programming, coding, cs'
  },
  {
    title: 'Advanced Engineering Math',
    description: 'Complex variables and laplace transforms.',
    type: 'video',
    subject: 'Applied Mathematics',
    grade_level: 'University',
    file_url: 'https://www.youtube.com/watch?v=XFDM1ip5HCI',
    access_level: 'premium',
    tags: 'engineering, math, university'
  }
];

const studyMaterials = [
  {
    title: 'University Physics Vol 1',
    description: 'Mechanics, Sound, Oscillations, and Waves. Comprehensive OpenStax textbook.',
    type: 'study-notes',
    subject: 'Physics',
    grade_level: 'University',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVolume1-OP.pdf',
    access_level: 'free',
    tags: 'physics, mechanics, textbook, openstax',
    file_type: 'pdf'
  },
  {
    title: 'Calculus Volume 1',
    description: 'Functions, limits, derivatives, and integration. OpenStax official textbook.',
    type: 'study-notes',
    subject: 'Mathematics',
    grade_level: 'University',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVolume1-OP.pdf',
    access_level: 'free',
    tags: 'math, calculus, textbook, openstax',
    file_type: 'pdf'
  },
  {
    title: 'Chemistry 2e',
    description: 'Fundamental concepts of chemistry including atoms, molecules, and reactions.',
    type: 'study-notes',
    subject: 'Chemistry',
    grade_level: 'University',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/Chemistry2e-OP.pdf',
    access_level: 'free',
    tags: 'chemistry, textbook, openstax',
    file_type: 'pdf'
  },
  {
    title: 'Biology 2e',
    description: 'Comprehensive biology textbook covering cell structure, genetics, and evolution.',
    type: 'study-notes',
    subject: 'Biology',
    grade_level: '12',
    file_url: 'https://assets.openstax.org/oscms-prodcms/media/documents/Biology2e-OP.pdf',
    access_level: 'free',
    tags: 'biology, life science, textbook, openstax',
    file_type: 'pdf'
  }
];

async function seedContent() {
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

    // Function to insert resource
    const insertResource = async (resource) => {
      const sql = `
        INSERT INTO resources 
        (title, description, type, subject, grade_level, file_url, file_path, file_name, access_level, 
         tags, file_type, file_size, status, uploader_type, uploaded_by, language, year, semester)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1024, 'approved', 'admin', 1, 'English', '2024', '1')
      `;
      const values = [
        resource.title,
        resource.description,
        resource.type,
        resource.subject,
        resource.grade_level,
        resource.file_url,
        resource.file_url, // Use same URL for file_path
        resource.title.replace(/ /g, '_') + '.' + (resource.file_type || 'mp4'), // Dummy filename
        resource.access_level,
        resource.tags,
        resource.file_type || 'mp4'
      ];
      await connection.execute(sql, values);
      console.log(`Added: ${resource.title}`);
    };

    console.log('Seeding Videos...');
    for (const video of videos) {
      await insertResource(video);
    }

    console.log('Seeding Study Materials (Unsplash)...');
    for (const material of studyMaterials) {
      await insertResource(material);
    }

    console.log('Seeding complete!');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    if (connection) await connection.end();
  }
}

seedContent();
