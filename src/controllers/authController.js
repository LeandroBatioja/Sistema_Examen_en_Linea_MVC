const User = require('../models/User');

function showLogin(req, res) {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('login', {
    pageTitle: 'Iniciar Sesion',
    error: req.query.error || null,
    success: req.query.success || null
  });
}

function showRegister(req, res) {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('register', {
    pageTitle: 'Crear Cuenta',
    error: null
  });
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('login', {
      pageTitle: 'Iniciar Sesion',
      error: 'Por favor complete todos los campos',
      success: null
    });
  }

  const result = await User.authenticate(username, password);

  if (!result.success) {
    return res.render('login', {
      pageTitle: 'Iniciar Sesion',
      error: result.error,
      success: null
    });
  }

  req.session.userId = result.user.id;
  req.session.userName = result.user.full_name;
  res.redirect('/dashboard');
}

async function register(req, res) {
  const { username, email, password, password_confirm, full_name } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.render('register', {
      pageTitle: 'Crear Cuenta',
      error: 'Por favor complete todos los campos'
    });
  }

  if (password !== password_confirm) {
    return res.render('register', {
      pageTitle: 'Crear Cuenta',
      error: 'Las contrasenas no coinciden'
    });
  }

  if (password.length < 6) {
    return res.render('register', {
      pageTitle: 'Crear Cuenta',
      error: 'La contrasena debe tener al menos 6 caracteres'
    });
  }

  const result = await User.create(username, email, password, full_name);

  if (!result.success) {
    return res.render('register', {
      pageTitle: 'Crear Cuenta',
      error: result.error
    });
  }

  res.redirect('/login?success=Cuenta creada exitosamente. Inicie sesion.');
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/login');
  });
}

module.exports = { showLogin, showRegister, login, register, logout };
