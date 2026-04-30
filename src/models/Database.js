const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../../data/examenes.db');

let SQL;
let dbInstance;
let dbWrapper;

class Statement {
  constructor(database, sql) {
    this.db = database;
    this.sql = sql;
  }

  run(...params) {
    this.db.run(this.sql, params);
    const result = this.db.exec('SELECT last_insert_rowid() as id');
    return { lastInsertRowid: result[0].values[0][0] };
  }

  get(...params) {
    const results = this.db.exec(this.sql, params);
    if (!results.length || !results[0].values.length) {
      return undefined;
    }
    const columns = results[0].columns;
    const values = results[0].values[0];
    const row = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });
    return row;
  }

  all(...params) {
    const results = this.db.exec(this.sql, params);
    if (!results.length || !results[0].values.length) {
      return [];
    }
    const columns = results[0].columns;
    return results[0].values.map(values => {
      const row = {};
      columns.forEach((col, i) => {
        row[col] = values[i];
      });
      return row;
    });
  }
}

function createWrapper(database) {
  return {
    prepare(sql) {
      return new Statement(database, sql);
    },
    exec(sql) {
      database.exec(sql);
    },
    run(sql, params) {
      if (params && params.length > 0) {
        database.run(sql, params);
      } else {
        database.run(sql);
      }
      const result = database.exec('SELECT last_insert_rowid() as id');
      return { lastInsertRowid: result[0].values[0][0] };
    }
  };
}

async function init() {
  if (!SQL) {
    SQL = await initSqlJs();
  }

  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    dbInstance = new SQL.Database(fileBuffer);
  } else {
    dbInstance = new SQL.Database();
  }

  dbWrapper = createWrapper(dbInstance);
  initTables();

  if (!fs.existsSync(DB_PATH)) {
    seedData();
    save();
  }

  return dbWrapper;
}

function save() {
  if (dbInstance) {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

function initTables() {
  dbWrapper.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      time_limit_minutes INTEGER DEFAULT 30,
      questions_per_page INTEGER DEFAULT 5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_option TEXT NOT NULL CHECK(correct_option IN ('a','b','c','d')),
      FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      exam_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (exam_id) REFERENCES exams(id)
    );
  `);
}

function seedData() {
  const countResult = dbWrapper.prepare('SELECT COUNT(*) as count FROM exams').get();
  if (!countResult || countResult.count === 0) {
    const hash = bcrypt.hashSync('estudiante123', 10);
    dbWrapper.prepare(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)'
    ).run('estudiante', 'estudiante@universidad.edu', hash, 'Estudiante Demo');

    dbWrapper.prepare(
      'INSERT INTO exams (title, description, time_limit_minutes, questions_per_page) VALUES (?, ?, ?, ?)'
    ).run('Examen de Fundamentos de Programacion', 'Evaluacion de conceptos basicos de programacion, algoritmos y estructuras de datos.', 30, 5);

    const examIdResult = dbWrapper.prepare('SELECT last_insert_rowid() as id').get();
    const examId = examIdResult.id;

    const questions = [
      ['Que es una variable en programacion?', 'Un espacio en memoria para almacenar datos', 'Un tipo de bucle', 'Una funcion especial', 'Un lenguaje de programacion', 'a'],
      ['Cual estructura se usa para repetir un bloque de codigo?', 'Condicion if', 'Bucle for o while', 'Declaracion de variable', 'Comentario', 'b'],
      ['Que es un arreglo o array?', 'Una base de datos', 'Un tipo de variable booleana', 'Una coleccion ordenada de elementos', 'Un sistema operativo', 'c'],
      ['Que hace la funcion return?', 'Borra una variable', 'Imprime en pantalla', 'Detiene el programa', 'Devuelve un valor desde una funcion', 'd'],
      ['Cual es el resultado de 5 modulo 2 (5 % 2)?', '2.5', '2', '1', '0', 'c'],
      ['Que es un algoritmo?', 'Un lenguaje de programacion', 'Una secuencia de pasos para resolver un problema', 'Un tipo de computadora', 'Un sistema de archivos', 'b'],
      ['Cual estructura de datos usa el principio Primero en Entrar Primero en Salir?', 'Pila (Stack)', 'Cola (Queue)', 'Arbol (Tree)', 'Grafo (Graph)', 'b'],
      ['Que significa debuggear un programa?', 'Escribir codigo nuevo', 'Compilar el codigo', 'Encontrar y corregir errores', 'Instalar dependencias', 'c'],
      ['Cual es la complejidad de busqueda en un arreglo no ordenado?', 'O(1)', 'O(log n)', 'O(n)', 'O(n al cuadrado)', 'c'],
      ['Que es la programacion orientada a objetos?', 'Un estilo que organiza el codigo en objetos con datos y comportamientos', 'Programar solo con funciones', 'Usar solo variables globales', 'Escribir codigo sin estructura', 'a']
    ];

    questions.forEach(q => {
      dbWrapper.prepare(
        'INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(examId, ...q);
    });
  }
}

function getDb() {
  if (!dbWrapper) {
    throw new Error('Database not initialized. Call init() first.');
  }
  return dbWrapper;
}

module.exports = { init, getDb, save };
