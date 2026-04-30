const Exam = require('../models/Exam');
const Question = require('../models/Question');
const { getDb } = require('../models/Database');

function showResults(req, res) {
  const exam = Exam.findById(req.params.id);

  if (!exam) {
    return res.redirect('/dashboard');
  }

  const db = getDb();
  const examResult = db.prepare(
    'SELECT * FROM results WHERE user_id = ? AND exam_id = ? ORDER BY completed_at DESC LIMIT 1'
  ).get(req.session.userId, exam.id);

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
