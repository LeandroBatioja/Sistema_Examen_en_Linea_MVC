const Exam = require('../models/Exam');
const Question = require('../models/Question');
const { getDb } = require('../models/Database');

async function showResults(req, res) {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return res.redirect('/dashboard');
  }

  const db = getDb();
  const result = await db.query(
    'SELECT * FROM results WHERE user_id = $1 AND exam_id = $2 ORDER BY completed_at DESC LIMIT 1',
    [req.session.userId, exam.id]
  );
  const examResult = result.rows[0];

  if (!examResult) {
    return res.redirect('/dashboard');
  }

  const percentage = Math.round((examResult.score / examResult.total_questions) * 100);
  const passed = percentage >= 60;

  let message;
  let messageIcon;
  if (percentage >= 90) {
    message = 'Excelente dominio del tema';
    messageIcon = 'trophy';
  } else if (percentage >= 70) {
    message = 'Buen desempeno, sigue practicando';
    messageIcon = 'thumbs-up';
  } else if (percentage >= 60) {
    message = 'Aprobado, pero puede mejorar';
    messageIcon = 'check';
  } else {
    message = 'No aprobado, revise el material y vuelva a intentar';
    messageIcon = 'book';
  }

  res.render('results', {
    pageTitle: 'Resultados del Examen',
    exam,
    score: examResult.score,
    totalQuestions: examResult.total_questions,
    percentage,
    passed,
    message,
    messageIcon,
    userName: req.session.userName
  });
}

module.exports = { showResults };
