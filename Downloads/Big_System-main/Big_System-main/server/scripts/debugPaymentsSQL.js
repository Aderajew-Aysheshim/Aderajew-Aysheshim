const { query } = require('../config/mysqlDatabase');

async function debugPayments() {
  try {
    const status = 'all';
    let sql = `
      SELECT pv.*, 
             COALESCE(s.full_name, t.full_name) as user_name,
             COALESCE(s.email, t.email) as user_email,
             CASE 
               WHEN pv.student_id IS NOT NULL THEN 'student'
               WHEN pv.tutor_id IS NOT NULL THEN 'tutor'
               ELSE 'unknown'
             END as user_type,
             a.full_name as admin_name
      FROM payment_verifications pv
      LEFT JOIN students s ON pv.student_id = s.id
      LEFT JOIN tutors t ON pv.tutor_id = t.id
      LEFT JOIN admins a ON pv.verified_by = a.id
    `;

    const queryParams = [];
    if (status && status !== 'all') {
      sql += ` WHERE pv.status = ?`;
      queryParams.push(status);
    }

    sql += ` ORDER BY pv.created_at DESC`;

    console.log('Executing SQL:', sql);
    const verifications = await query(sql, queryParams);
    console.log('Found verifications:', verifications.length);
    if (verifications.length > 0) {
      console.log('First record sample:', verifications[0]);
    }
  } catch (error) {
    console.error('DEBUG ERROR:', error);
  } finally {
    process.exit();
  }
}

debugPayments();
