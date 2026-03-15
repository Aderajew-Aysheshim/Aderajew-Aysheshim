const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const courses = [
  {
    title: 'Complete Web Development Bootcamp',
    subtitle: 'Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB and more!',
    description: 'Master Web Development in this comprehensive course. You will learn everything from the basics of HTML5 and CSS3 to advanced concepts in React and Node.js. This course includes real-world projects, quizzes, and hands-on exercises to ensure you gain practical experience. Perfect for beginners and experienced developers looking to upgrade their skills.',
    difficulty_level: 'beginner',
    category: 'Computer Science',
    subject: 'Web Development',
    price: 1999.99,
    duration_hours: 60,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1472&q=80',
    video_url: 'https://www.youtube.com/embed/pQN-pnXPaVg',
    what_you_will_learn: 'HTML5,CSS3,JavaScript,React,Node.js,Express,MongoDB',
    requirements: 'No prior programming experience needed. A computer with internet access.',
    tags: 'web development,javascript,react,node,full stack'
  },
  {
    title: 'Advanced Machine Learning & AI',
    subtitle: 'Master Machine Learning, Deep Learning, and AI with Python, TensorFlow, and PyTorch.',
    description: 'Dive deep into the world of Artificial Intelligence. This course covers advanced probability, statistics, and machine learning algorithms. You will build neural networks, work with natural language processing (NLP), and computer vision. Join thousands of students in mastering the technology of the future.',
    difficulty_level: 'advanced',
    category: 'Computer Science',
    subject: 'Artificial Intelligence',
    price: 2499.00,
    duration_hours: 45,
    thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80',
    video_url: 'https://www.youtube.com/embed/GwIo3gDZCVQ',
    what_you_will_learn: 'Machine Learning,Deep Learning,TensorFlow,PyTorch,Computer Vision',
    requirements: 'Basic Python programming and understanding of mathematics (calculus, linear algebra).',
    tags: 'ai,machine learning,python,data science'
  },
  {
    title: 'Graphic Design Masterclass',
    subtitle: 'Learn the ultimate tools for Graphic Design: Photoshop, Illustrator, and InDesign.',
    description: 'Unleash your creativity with this complete graphic design course. Learn design theory, color psychology, and typography. Master the industry-standard tools for creating stunning logos, posters, social media graphics, and more. Build a professional portfolio that will get you hired.',
    difficulty_level: 'intermediate',
    category: 'Design',
    subject: 'Graphic Design',
    price: 1499.50,
    duration_hours: 35,
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    video_url: 'https://www.youtube.com/embed/un50Bs4Bve8',
    what_you_will_learn: 'Adobe Photoshop,Illustrator,InDesign,Design Theory,Branding',
    requirements: 'Access to Adobe Creative Cloud (trial or subscription).',
    tags: 'design,graphic design,photoshop,illustrator,creativity'
  },
  {
    title: 'Digital Marketing Strategy 2024',
    subtitle: 'Master SEO, Social Media Marketing, Email Marketing, and Analytics.',
    description: 'Grow your business or career with data-driven digital marketing strategies. Learn how to optimize websites for search engines (SEO), run effective ad campaigns on Facebook and Google, and engage audiences on social media. This course is packed with practical templates and strategies.',
    difficulty_level: 'beginner',
    category: 'Business',
    subject: 'Marketing',
    price: 1200.00,
    duration_hours: 25,
    thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1476&q=80',
    video_url: 'https://www.youtube.com/embed/nU-IIXJLwpE',
    what_you_will_learn: 'SEO,Social Media Marketing,Google Ads,Content Marketing,Analytics',
    requirements: 'No prior marketing experience required.',
    tags: 'marketing,digital marketing,seo,social media,business'
  },
  {
    title: 'Financial Analysis & Valuation',
    subtitle: 'The complete financial analyst training course. Excel, Accounting, Financial Modeling.',
    description: 'Become a financial analyst expert. Learn how to read financial statements, build complex financial models in Excel, and perform business valuation. This course is designed for aspiring investment bankers, equity research analysts, and corporate finance professionals.',
    difficulty_level: 'advanced',
    category: 'Business',
    subject: 'Finance',
    price: 2999.00,
    duration_hours: 50,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1611&q=80',
    video_url: 'https://www.youtube.com/embed/QkZ003Z93X8',
    what_you_will_learn: 'Financial Modeling,Excel,Accounting,Valuation,Investment Analysis',
    requirements: 'Basic understanding of Excel and accounting principles.',
    tags: 'finance,excel,investment,accounting,business'
  }
];

async function seedCourses() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'tutorhub_db'
    });

    console.log('Checking and Updating database schema...');

    // 1. Add all missing columns required by the Enhanced Routes
    const columnsToAdd = [
      'tutor_id INT',
      'subtitle TEXT',
      'what_you_will_learn TEXT',
      'requirements TEXT',
      'subject VARCHAR(255)',
      'grade_level VARCHAR(255)',
      'difficulty_level VARCHAR(50)', // Code expects this, DB has 'level'
      'max_students INT DEFAULT 50',
      'tags TEXT',
      'language VARCHAR(50) DEFAULT "English"',
      'status VARCHAR(50) DEFAULT "draft"', // Code expects this, DB has is_active/is_published
      'thumbnail TEXT',
      'video_url TEXT',
      'price DECIMAL(10, 2)'
    ];

    for (const colDef of columnsToAdd) {
      const colName = colDef.split(' ')[0];
      try {
        await connection.query(`ALTER TABLE courses ADD COLUMN ${colDef}`);
        console.log(`✅ Added column: ${colName}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          // Column exists, ignore
        } else {
          console.log(`⚠️ Could not add ${colName}: ${err.message}`);
        }
      }
    }

    // 2. Ensure we have a tutor
    const [tutors] = await connection.query('SELECT id FROM tutors LIMIT 1');
    let tutorId;

    if (tutors.length === 0) {
      console.log('Creating a dummy tutor...');
      try {
        const [result] = await connection.query(`
          INSERT INTO tutors (full_name, email, password_hash, is_verified)
          VALUES ('Seed Tutor', 'seed@tutor.com', 'hash', TRUE)
         `);
        tutorId = result.insertId;
      } catch (err) {
        // Fallback if full_name schema is still somehow wrong or other issue
        console.log('Error creating tutor, checking schema...');
        throw err;
      }
    } else {
      tutorId = tutors[0].id;
    }

    // 3. Ensure categories (Using ON DUPLICATE KEY UPDATE or Check first)
    console.log('Ensuring categories exist...');
    const categories = ['Computer Science', 'Design', 'Business'];
    const categoryIds = {};

    for (const catName of categories) {
      const [cats] = await connection.query('SELECT id FROM course_categories WHERE name = ?', [catName]);
      if (cats.length > 0) {
        categoryIds[catName] = cats[0].id;
      } else {
        const [res] = await connection.query('INSERT INTO course_categories (name, description) VALUES (?, ?)', [catName, `${catName} Courses`]);
        categoryIds[catName] = res.insertId;
      }
    }

    // 4. Insert Courses
    console.log('Seeding courses...');
    for (const course of courses) {
      const catId = categoryIds[course.category];

      // Clean up inputs
      const price = course.price || 0;

      await connection.query(`
        INSERT INTO courses (
          tutor_id, category_id, title, subtitle, description, 
          difficulty_level, subject, price, duration_hours, 
          thumbnail, video_url, what_you_will_learn, requirements, tags, status,
          language
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', 'English')
      `, [
        tutorId, catId, course.title, course.subtitle, course.description,
        course.difficulty_level, course.subject, price, course.duration_hours,
        course.thumbnail, course.video_url, course.what_you_will_learn, course.requirements, course.tags
      ]);
      console.log(`Inserted course: ${course.title}`);
    }

    console.log('\n✅ Course seeding and schema update completed!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    if (connection) await connection.end();
  }
}

seedCourses();
