const { getDb } = require('./Database');

class Question {
  static async findById(id) {
    const db = getDb();
    const result = await db.query('SELECT * FROM questions WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async saveResult(userId, examId, score, totalQuestions) {
    const db = getDb();
    const result = await db.query(
      'INSERT INTO results (user_id, exam_id, score, total_questions) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, examId, score, totalQuestions]
    );
    return result.rows[0];
  }

  static async getUserResults(userId) {
    const db = getDb();
    const result = await db.query(
      `SELECT r.id, r.score, r.total_questions, r.completed_at, e.title
       FROM results r
       JOIN exams e ON r.exam_id = e.id
       WHERE r.user_id = $1
       ORDER BY r.completed_at DESC`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Question;
