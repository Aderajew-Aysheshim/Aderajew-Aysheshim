
const { query } = require('../config/mysqlDatabase');

class AdminSQL {
 
  static async findByEmail(email) {
    try {
      const rows = await query(
        'SELECT * FROM admins WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const rows = await query(
        'SELECT * FROM admins WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    if (!candidatePassword || !hashedPassword) return false;
    const bcrypt = require('bcryptjs');
    try {
      return await bcrypt.compare(String(candidatePassword), hashedPassword);
    } catch (e) {
      console.error('Bcrypt comparison error:', e.message);
      return false;
    }
  }

  static async create(adminData) {
    try {
      const { full_name, email, password_hash, role = 'admin', is_active = 1 } = adminData;
      const result = await query(
        'INSERT INTO admins (full_name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)',
        [full_name, email, password_hash, role, is_active]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const fields = [];
      const values = [];

      Object.keys(updateData).forEach(key => {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      });

      values.push(id);

      await query(
        `UPDATE admins SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getDashboardStats() {
    try {
      const [studentCount] = await query('SELECT COUNT(*) as count FROM students');
      const [tutorCount] = await query('SELECT COUNT(*) as count FROM tutors');
      const [verifiedTutors] = await query('SELECT COUNT(*) as count FROM tutors WHERE is_verified = 1');
      const [pendingTutors] = await query('SELECT COUNT(*) as count FROM tutors WHERE is_verified = 0');
      const [conversationCount] = await query('SELECT COUNT(*) as count FROM conversations');
      const [messageCount] = await query('SELECT COUNT(*) as count FROM messages');

      return {
        totalStudents: Number(studentCount.count),
        totalTutors: Number(tutorCount.count),
        verifiedTutors: Number(verifiedTutors.count),
        pendingTutors: Number(pendingTutors.count),
        totalConversations: Number(conversationCount.count),
        totalMessages: Number(messageCount.count)
      };
    } catch (error) {
      throw error;
    }
  }

  static async getAllStudents(limit = 50, offset = 0) {
    try {
      const rows = await query(
        'SELECT * FROM students ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getAllTutors(limit = 50, offset = 0) {
    try {
      const rows = await query(
        'SELECT * FROM tutors ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getAllConversations(limit = 50, offset = 0) {
    try {
      const rows = await query(`
        SELECT 
          c.*,
          s.full_name as student_name,
          t.full_name as tutor_name
        FROM conversations c
        LEFT JOIN students s ON c.student_id = s.id
        LEFT JOIN tutors t ON c.tutor_id = t.id
        ORDER BY c.last_message_at DESC
        LIMIT ? OFFSET ?
      `, [limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getMessagesByConversationId(conversationId) {
    try {
      const rows = await query(`
        SELECT 
          m.*,
          CASE 
            WHEN m.sender_type = 'student' THEN s.full_name
            WHEN m.sender_type = 'tutor' THEN t.full_name
            WHEN m.sender_type = 'admin' THEN 'Administrator'
          END as sender_name
        FROM messages m
        LEFT JOIN students s ON m.sender_id = s.id AND m.sender_type = 'student'
        LEFT JOIN tutors t ON m.sender_id = t.id AND m.sender_type = 'tutor'
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
      `, [conversationId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async verifyTutor(tutorId) {
    try {
      await query(
        'UPDATE tutors SET is_verified = 1 WHERE id = ?',
        [tutorId]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getSettings() {
    try {
      const rows = await query('SELECT * FROM system_settings ORDER BY setting_key');
      const settings = {};
      rows.forEach(row => {
        settings[row.setting_key] = row.setting_value;
      });
      return settings;
    } catch (error) {
      throw error;
    }
  }

  static async updateSetting(key, value) {
    try {
      await query(
        'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AdminSQL;
