const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function createExitExamSchema() {
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

    const sql = `
      CREATE TABLE IF NOT EXISTS exit_exams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(100) NOT NULL,
        year VARCHAR(4),
        duration_minutes INT DEFAULT 120,
        total_questions INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS exit_exam_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        exam_id INT NOT NULL,
        question_text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exam_id) REFERENCES exit_exams(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS student_exam_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        exam_id INT NOT NULL,
        score INT NOT NULL,
        total_questions INT NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (exam_id) REFERENCES exit_exams(id) ON DELETE CASCADE
      );
    `;

    await connection.query(sql);
    console.log('Exit Exam tables created successfully.');

    // Seed a sample exam
    const [exams] = await connection.query('SELECT * FROM exit_exams LIMIT 1');
    if (exams.length === 0) {
      console.log('Seeding sample exit exam...');
      const [result] = await connection.query(`
            INSERT INTO exit_exams (title, description, subject, year, duration_minutes, total_questions)
            VALUES ('Software Engineering Exit Exam 2016', 'Official exit exam for SE graduates.', 'Software Engineering', '2016', 180, 5)
        `);
      const examId = result.insertId;

      await connection.query(`
            INSERT INTO exit_exam_questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
            VALUES 
            (?, 'Which of the following is NOT a phase in the SDLC?', 'Planning', 'Coding', 'Marketing', 'Testing', 'C', 'Marketing is part of business strategy, not the development lifecycle.'),
            (?, 'What does ACID stand for in databases?', 'Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Isolation, Data', 'Atomicity, Code, Isolation, Debugging', 'None of the above', 'A', 'ACID properties ensure reliable database transactions.'),
            (?, 'In OOP, what is Polymorphism?', 'Hiding data', 'Inheriting properties', 'Many forms', 'Creating objects', 'C', 'Polymorphism allows objects to be treated as instances of their parent class.'),
            (?, 'What is the time complexity of binary search?', 'O(n)', 'O(log n)', 'O(n^2)', 'O(1)', 'B', 'Binary search divides the search space in half each step.'),
            (?, 'Which protocol is used for secure web browsing?', 'HTTP', 'FTP', 'SMTP', 'HTTPS', 'D', 'HTTPS encrypts communication using TLS/SSL.')
        `, [examId, examId, examId, examId, examId]);
      console.log('Sample exam seeded.');
    }

  } catch (error) {
    console.error('Error creating schema:', error);
  } finally {
    if (connection) await connection.end();
  }
}

createExitExamSchema();
