#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
let warnings = 0;

function check(name, condition, detail) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name}`);
    if (detail) console.log(`    Detalle: ${detail}`);
    failed++;
  }
}

function warn(name, detail) {
  console.log(`  ! ${name}`);
  if (detail) console.log(`    Detalle: ${detail}`);
  warnings++;
}

function readFileContent(dir, fileName) {
  const filePath = path.join(__dirname, '..', dir, fileName);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf-8');
}

console.log('=== Evaluacion Heuristica - Sistema de Examenes en Linea ===\n');

console.log('1. ESTRUCTURA DE ARCHIVOS');
const projectRoot = path.join(__dirname, '..');
check('Directorio models existe', fs.existsSync(path.join(projectRoot, 'src/models')));
check('Directorio controllers existe', fs.existsSync(path.join(projectRoot, 'src/controllers')));
check('Directorio views existe', fs.existsSync(path.join(projectRoot, 'src/views')));
check('Directorio routes existe', fs.existsSync(path.join(projectRoot, 'src/routes')));
check('Directorio public/css existe', fs.existsSync(path.join(projectRoot, 'src/public/css')));
check('Directorio public/js existe', fs.existsSync(path.join(projectRoot, 'src/public/js')));
check('Directorio docs existe', fs.existsSync(path.join(projectRoot, 'docs')));

console.log('\n2. PATRON MVC');
check('Database.js existe', fs.existsSync(path.join(projectRoot, 'src/models/Database.js')));
check('User.js modelo existe', fs.existsSync(path.join(projectRoot, 'src/models/User.js')));
check('Exam.js modelo existe', fs.existsSync(path.join(projectRoot, 'src/models/Exam.js')));
check('Question.js modelo existe', fs.existsSync(path.join(projectRoot, 'src/models/Question.js')));
check('authController.js existe', fs.existsSync(path.join(projectRoot, 'src/controllers/authController.js')));
check('examController.js existe', fs.existsSync(path.join(projectRoot, 'src/controllers/examController.js')));
check('resultController.js existe', fs.existsSync(path.join(projectRoot, 'src/controllers/resultController.js')));
check('routes/index.js existe', fs.existsSync(path.join(projectRoot, 'src/routes/index.js')));
check('app.js entry point existe', fs.existsSync(path.join(projectRoot, 'src/app.js')));

console.log('\n3. VISTAS ACCESIBLES (ARIA y Orca)');
const layout = readFileContent('src/views/layouts', 'main.ejs');
const login = readFileContent('src/views', 'login.ejs');
const register = readFileContent('src/views', 'register.ejs');
const exam = readFileContent('src/views', 'exam.ejs');
const dashboard = readFileContent('src/views', 'dashboard.ejs');
const results = readFileContent('src/views', 'results.ejs');

check('Layout tiene lang="es"', layout && layout.includes('lang="es"'));
check('Layout tiene skip-link', layout && layout.includes('skip-link'));
check('Layout tiene role="main"', layout && layout.includes('role="main"'));
check('Layout tiene role="navigation"', layout && layout.includes('role="navigation"'));
check('Layout tiene role="banner"', layout && layout.includes('role="banner"'));
check('Layout tiene role="contentinfo"', layout && layout.includes('role="contentinfo"'));
check('Layout tiene aria-label en nav', layout && layout.includes('aria-label'));

console.log('\n4. INDEPENDENCIA DEL COLOR (No solo color para informar)');
check('Alertas de error tienen icono', login && login.includes('alert-icon'));
check('Alertas de error tienen texto', login && login.includes('alert-text'));
check('Alertas usan role="alert"', login && login.includes('role="alert"'));
check('Alertas usan aria-live', login && login.includes('aria-live'));
check('Badges tienen texto + icono', dashboard && dashboard.includes('✓') && dashboard.includes('Aprobado'));

console.log('\n5. ETIQUETAS Y SOPORTE DE VOZ (Orca)');
check('Formularios tienen labels', login && login.includes('<label'));
check('Inputs tienen aria-required', login && login.includes('aria-required'));
check('Inputs tienen aria-describedby', login && login.includes('aria-describedby'));
check('Botones tienen aria-label', login && login.includes('aria-label'));
check('Exam tiene fieldset y legend', exam && exam.includes('<fieldset'));
check('Exam tiene aria-labelledby', exam && exam.includes('aria-labelledby'));
check('Progress bar tiene role="progressbar"', exam && exam.includes('role="progressbar"'));

console.log('\n6. FLEXIBILIDAD DE ENTRADA');
const keyboardJs = readFileContent('src/public/js', 'keyboard-nav.js');
check('keyboard-nav.js existe', !!keyboardJs);
check('Soporte flechas en radio buttons', keyboardJs && keyboardJs.includes('ArrowDown'));
check('Atajos de teclado (Alt+)', keyboardJs && keyboardJs.includes('altKey'));
check('Validacion con focus en error', keyboardJs && keyboardJs.includes('focus'));
check('Skip link en CSS', fs.existsSync(path.join(projectRoot, 'src/public/css/style.css')) &&
  readFileContent('src/public/css', 'style.css').includes('.skip-link'));

console.log('\n7. ERGONOMIA COGNITIVA (Regla 5 ± 2)');
const examCtrl = readFileContent('src/controllers', 'examController.js');
check('Paginacion de preguntas', examCtrl && examCtrl.includes('questions_per_page'));
check('Maximo 5 preguntas por pagina por defecto',
  readFileContent('src/models', 'Database.js').includes('questions_per_page INTEGER DEFAULT 5'));
check('Variables nombradas claramente', examCtrl && !examCtrl.includes('var x=') && !examCtrl.includes('const a='));

console.log('\n8. DOCUMENTACION');
check('UML-Diagram.md existe', fs.existsSync(path.join(projectRoot, 'docs/UML-Diagram.md')));
check('ISO9241-Justification.md existe', fs.existsSync(path.join(projectRoot, 'docs/ISO9241-Justification.md')));
check('UX-Report.md existe', fs.existsSync(path.join(projectRoot, 'docs/UX-Report.md')));
check('README.md existe', fs.existsSync(path.join(projectRoot, 'README.md')));

console.log('\n9. ACCESIBILIDAD CSS');
const css = readFileContent('src/public/css', 'style.css');
check('Focus visible definido', css && css.includes(':focus-visible'));
check('Skip link estilos', css && css.includes('.skip-link'));
check('Alto contraste soportado', css && css.includes('prefers-contrast'));
check('Movimiento reducido soportado', css && css.includes('prefers-reduced-motion'));
check('Font-size en rem', css && css.includes('font-size: 100%'));
check('Colores de error con borde', css && css.includes('border-color: var(--color-error)'));

console.log('\n=== RESULTADO FINAL ===');
console.log(`Pasaron:    ${passed}`);
console.log(`Fallaron:   ${failed}`);
console.log(`Advertencias: ${warnings}`);
console.log(`Total:      ${passed + failed + warnings}`);
console.log(`\nPorcentaje de cumplimiento: ${Math.round((passed / (passed + failed)) * 100)}%`);

if (failed === 0) {
  console.log('\n✓ Todas las verificaciones heurísticas pasaron exitosamente.');
  process.exit(0);
} else {
  console.log(`\n✗ ${failed} verificaciones fallaron. Revisar arriba para detalles.`);
  process.exit(1);
}
