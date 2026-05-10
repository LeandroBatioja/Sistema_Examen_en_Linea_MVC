const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const examController = require('../controllers/examController');
const resultController = require('../controllers/resultController');

function requireAuth(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

router.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/register', authController.showRegister);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

router.get('/dashboard', requireAuth, examController.showDashboard);

router.get('/exam/:id', requireAuth, examController.showExam);
router.get('/exam/:id/page/:page', requireAuth, examController.showExamPage);
router.post('/exam/:id/submit/:page', requireAuth, examController.submitAnswers);
router.get('/exam/:id/finish', requireAuth, examController.finishExam);
router.all('/exam/:id/abort', requireAuth, examController.abortExam);

router.get('/results/:id', requireAuth, resultController.showResults);

module.exports = router;
