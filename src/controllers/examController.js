const Exam = require('../models/Exam');
const Question = require('../models/Question');

function showDashboard(req, res) {
  const exams = Exam.findAll();
  const results = Question.getUserResults(req.session.userId);
  res.render('dashboard', {
    pageTitle: 'Panel de Examenes',
    userName: req.session.userName,
    exams,
    results
  });
}

function showExam(req, res) {
  const exam = Exam.findById(req.params.id);

  if (!exam) {
    return res.redirect('/dashboard');
  }

  if (Exam.checkResultExists(req.session.userId, exam.id)) {
    return res.redirect(`/results/${exam.id}`);
  }

  const totalQuestions = Exam.getQuestionCount(exam.id);
  const perPage = exam.questions_per_page;
  const totalPages = Math.ceil(totalQuestions / perPage);
  const currentPage = 1;

  const questions = Exam.getQuestionsPaginated(exam.id, currentPage, perPage);

  res.render('exam', {
    pageTitle: exam.title,
    exam,
    questions,
    currentPage,
    totalPages,
    totalQuestions,
    perPage,
    error: null,
    userName: req.session.userName,
    previousAnswers: req.session[`exam_${exam.id}_answers`] || {}
  });
}

function showExamPage(req, res) {
  const exam = Exam.findById(req.params.id);

  if (!exam) {
    return res.redirect('/dashboard');
  }

  const totalQuestions = Exam.getQuestionCount(exam.id);
  const perPage = exam.questions_per_page;
  const totalPages = Math.ceil(totalQuestions / perPage);
  const currentPage = parseInt(req.params.page);

  if (currentPage < 1 || currentPage > totalPages) {
    return res.redirect(`/exam/${exam.id}`);
  }

  const questions = Exam.getQuestionsPaginated(exam.id, currentPage, perPage);

  res.render('exam', {
    pageTitle: exam.title,
    exam,
    questions,
    currentPage,
    totalPages,
    totalQuestions,
    perPage,
    error: req.query.error || null,
    userName: req.session.userName,
    previousAnswers: req.session[`exam_${exam.id}_answers`] || {}
  });
}

function submitAnswers(req, res) {
  const exam = Exam.findById(req.params.id);

  if (!exam) {
    return res.redirect('/dashboard');
  }

  const totalQuestions = Exam.getQuestionCount(exam.id);
  const perPage = exam.questions_per_page;
  const totalPages = Math.ceil(totalQuestions / perPage);
  const currentPage = parseInt(req.params.page);

  if (!req.session[`exam_${exam.id}_answers`]) {
    req.session[`exam_${exam.id}_answers`] = {};
  }

  for (let i = 1; i <= perPage; i++) {
    const answer = req.body[`question_${i}`];
    if (answer) {
      const globalIndex = (currentPage - 1) * perPage + i;
      req.session[`exam_${exam.id}_answers`][globalIndex] = answer;
    }
  }

  if (currentPage < totalPages) {
    return res.redirect(`/exam/${exam.id}/page/${currentPage + 1}`);
  }

  return res.redirect(`/exam/${exam.id}/finish`);
}

function finishExam(req, res) {
  const exam = Exam.findById(req.params.id);

  if (!exam) {
    return res.redirect('/dashboard');
  }

  if (Exam.checkResultExists(req.session.userId, exam.id)) {
    return res.redirect(`/results/${exam.id}`);
  }

  const answers = req.session[`exam_${exam.id}_answers`] || {};
  const allQuestions = Exam.getAllQuestions(exam.id);

  let score = 0;
  allQuestions.forEach((q, index) => {
    const questionNum = index + 1;
    if (answers[questionNum] === q.correct_option) {
      score++;
    }
  });

  Question.saveResult(req.session.userId, exam.id, score, allQuestions.length);

  delete req.session[`exam_${exam.id}_answers`];

  res.redirect(`/results/${exam.id}`);
}

module.exports = { showDashboard, showExam, showExamPage, submitAnswers, finishExam };
