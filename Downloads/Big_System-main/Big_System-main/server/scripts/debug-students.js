const { query } = require('../config/mysqlDatabase');
const dotenv = require('dotenv');
dotenv.config();

async function checkStudents() {
  try {
    console.log('Checking students table...');
    const students = await query('SELECT id, email, full_name , password_hash FROM students');
    console.log(`Found ${students.length} students:`);
    students.forEach(s => console.log(`- ID: ${s.id}, Email: ${s.email}, Name: ${s.full_name}, Hash: ${s.password_hash ? 'Present' : 'Missing'}`));

    console.log('\nTo fix "Unauthorized", please Register a new account or use one of the emails above.');
  } catch (err) {
    console.error('Error querying students:', err);
  } finally {
    process.exit();
  }
}

checkStudents();
