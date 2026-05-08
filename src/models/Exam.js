const { getDb } = require('./Database');

class Exam {
  static async findAll() {
    const db = getDb();
    const result = await db.query('SELECT * FROM exams ORDER BY created_at DESC');
    return result.rows;
  }

  static async findById(id) {
    const db = getDb();
    const result = await db.query('SELECT * FROM exams WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getQuestionCount(examId) {
    const db = getDb();
    const result = await db.query('SELECT COUNT(*) as count FROM questions WHERE exam_id = $1', [examId]);
    return parseInt(result.rows[0].count);
  }

  static async getQuestionsPaginated(examId, page, perPage) {
    const db = getDb();
    const offset = (page - 1) * perPage;
    const result = await db.query(
      'SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions WHERE exam_id = $1 LIMIT $2 OFFSET $3',
      [examId, perPage, offset]
    );
    return result.rows;
  }

  static async getAllQuestions(examId) {
    const db = getDb();
    const result = await db.query(
      'SELECT id, correct_option FROM questions WHERE exam_id = $1',
      [examId]
    );
    return result.rows;
  }

  static async checkResultExists(userId, examId) {
    const db = getDb();
    const result = await db.query('SELECT id FROM results WHERE user_id = $1 AND exam_id = $2', [userId, examId]);
    return result.rows[0];
  }
}

module.exports = Exam;
