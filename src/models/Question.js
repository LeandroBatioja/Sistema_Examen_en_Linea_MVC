const { getDb } = require('./Database');

class Question {
  static findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
  }

  static saveResult(userId, examId, score, totalQuestions) {
    const db = getDb();
    return db.prepare(
      'INSERT INTO results (user_id, exam_id, score, total_questions) VALUES (?, ?, ?, ?)'
    ).run(userId, examId, score, totalQuestions);
  }

  static getUserResults(userId) {
    const db = getDb();
    return db.prepare(
      `SELECT r.id, r.score, r.total_questions, r.completed_at, e.title
       FROM results r
       JOIN exams e ON r.exam_id = e.id
       WHERE r.user_id = ?
       ORDER BY r.completed_at DESC`
    ).all(userId);
  }
}

module.exports = Question;
