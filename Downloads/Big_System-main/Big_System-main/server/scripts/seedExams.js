const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function seedExams() {
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

    // 1. Create the Exam Entry
    console.log('Creating Exam: Biology Model Exam 2016...');
    const [result] = await connection.execute(`
      INSERT INTO exit_exams (title, description, subject, year, duration_minutes, total_questions, is_active)
      VALUES (?, ?, ?, ?, ?, ?, TRUE)
    `, ['Biology Model Exam 2016', 'Comprehensive model exam based on Ethiopian University Entrance Exam standards.', 'Biology', '2016', 120, 10]);

    const examId = result.insertId;
    console.log(`Exam created with ID: ${examId}`);

    // 2. Add Questions
    const questions = [
      {
        text: 'Which of the following is the structural and functional unit of life?',
        a: 'Tissue', b: 'Organ', c: 'Cell', d: 'Organism',
        correct: 'C', explanation: 'The cell is the smallest unit of life that can replicate independently.'
      },
      {
        text: 'Which organelle is known as the powerhouse of the cell?',
        a: 'Nucleus', b: 'Mitochondria', c: 'Ribosome', d: 'Golgi Apparatus',
        correct: 'B', explanation: 'Mitochondria generate most of the chemical energy needed to power the cell\'s biochemical reactions.'
      },
      {
        text: 'What is the process by which green plants make their own food?',
        a: 'Respiration', b: 'Transpiration', c: 'Photosynthesis', d: 'Digestion',
        correct: 'C', explanation: 'Photosynthesis uses sunlight to synthesize foods from carbon dioxide and water.'
      },
      {
        text: 'Which of the following blood cells is involved in antibody production?',
        a: 'Red Blood Cells', b: 'Platelets', c: 'B-Lymphocytes', d: 'Monocytes',
        correct: 'C', explanation: 'B-lymphocytes (B cells) are a type of white blood cell that makes antibodies.'
      },
      {
        text: 'The genetic material in most living organisms is:',
        a: 'DNA', b: 'RNA', c: 'Protein', d: 'Lipid',
        correct: 'A', explanation: 'Deoxyribonucleic acid (DNA) carries genetic instructions.'
      },
      {
        text: 'Which hormone controls blood sugar levels?',
        a: 'Adrenaline', b: 'Thyroxine', c: 'Insulin', d: 'Estrogen',
        correct: 'C', explanation: 'Insulin regulates the metabolism of carbohydrates, fats and protein by promoting the absorption of glucose.'
      },
      {
        text: 'Who is known as the father of Genetics?',
        a: 'Charles Darwin', b: 'Gregor Mendel', c: 'Louis Pasteur', d: 'James Watson',
        correct: 'B', explanation: 'Gregor Mendel established many of the rules of heredity through his experiments on pea plants.'
      },
      {
        text: 'Which vitamin is essential for blood clotting?',
        a: 'Vitamin A', b: 'Vitamin C', c: 'Vitamin K', d: 'Vitamin D',
        correct: 'C', explanation: 'Vitamin K is needed for the synthesis of proteins required for blood coagulation.'
      },
      {
        text: 'The theory of evolution by natural selection was proposed by:',
        a: 'Lamarck', b: 'Darwin', c: 'Mendel', d: 'Wallace',
        correct: 'B', explanation: 'Charles Darwin proposed the theory of evolution by natural selection.'
      },
      {
        text: 'Which classification group contains the largest number of organisms?',
        a: 'Genus', b: 'Species', c: 'Phylum', d: 'Kingdom',
        correct: 'D', explanation: 'Kingdom is the highest standard rank (below Domain) and contains the most organisms.'
      }
    ];

    console.log('Seeding Questions...');
    const questionSql = `
      INSERT INTO exit_exam_questions 
      (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const q of questions) {
      await connection.execute(questionSql, [
        examId, q.text, q.a, q.b, q.c, q.d, q.correct, q.explanation
      ]);
    }

    console.log('✅ Exam and Questions seeded successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

seedExams();
