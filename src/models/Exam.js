const { getDb } = require('./Database');

class Exam {
  static findAll() {
    const db = getDb();
    return db.prepare('SELECT * FROM exams ORDER BY created_at DESC').all();
  }

  static findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM exams WHERE id = ?').get(id);
  }

  static getQuestionCount(examId) {
    const db = getDb();
    return db.prepare('SELECT COUNT(*) as count FROM questions WHERE exam_id = ?').get(examId).count;
  }

  static getQuestionsPaginated(examId, page, perPage) {
    const db = getDb();
    const offset = (page - 1) * perPage;
    return db.prepare(
      'SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions WHERE exam_id = ? LIMIT ? OFFSET ?'
    ).all(examId, perPage, offset);
  }

  static getAllQuestions(examId) {
    const db = getDb();
    return db.prepare(
      'SELECT id, correct_option FROM questions WHERE exam_id = ?'
    ).all(examId);
  }

  static checkResultExists(userId, examId) {
    const db = getDb();
    return db.prepare('SELECT id FROM results WHERE user_id = ? AND exam_id = ?').get(userId, examId);
  }
}

module.exports = Exam;
