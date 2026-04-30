const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const routes = require('./routes');
const db = require('./models/Database');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'examen-online-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2
  }
}));

app.use((req, res, next) => {
  res.locals.userName = req.session.userName || null;
  next();
});

app.use(routes);

app.use((req, res) => {
  res.status(404).render('404', {
    pageTitle: 'Pagina No Encontrada',
    userName: req.session.userName
  });
});

db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Sistema de Examenes en Linea: http://localhost:${PORT}`);
    console.log('Cuenta demo: estudiante / estudiante123');
  });
}).catch(err => {
  console.error('Error al inicializar la base de datos:', err);
  process.exit(1);
});
