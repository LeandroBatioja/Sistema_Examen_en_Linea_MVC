const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
});

async function init() {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const client = await pool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await client.query(`
          CREATE TABLE IF NOT EXISTS exams (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            time_limit_minutes INTEGER DEFAULT 30,
            questions_per_page INTEGER DEFAULT 5,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await client.query(`
          CREATE TABLE IF NOT EXISTS questions (
            id SERIAL PRIMARY KEY,
            exam_id INTEGER NOT NULL,
            question_text TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            correct_option TEXT NOT NULL CHECK(correct_option IN ('a','b','c','d')),
            FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
          )
        `);

        await client.query(`
          CREATE TABLE IF NOT EXISTS results (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            exam_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (exam_id) REFERENCES exams(id)
          )
        `);

        const countResult = await client.query('SELECT COUNT(*) as count FROM exams');
        if (countResult.rows[0].count === '0') {
          const hash = bcrypt.hashSync('estudiante123', 10);
          await client.query(
            'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4)',
            ['estudiante', 'estudiante@universidad.edu', hash, 'Estudiante Demo']
          );

          const examResult = await client.query(
            'INSERT INTO exams (title, description, time_limit_minutes, questions_per_page) VALUES ($1, $2, $3, $4) RETURNING id',
            ['Examen de Fundamentos de Programacion', 'Evaluacion de conceptos basicos de programacion, algoritmos y estructuras de datos.', 30, 5]
          );
          const examId = examResult.rows[0].id;

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

          for (const q of questions) {
            await client.query(
              'INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES ($1, $2, $3, $4, $5, $6, $7)',
              [examId, ...q]
            );
          }
        }
      } finally {
        client.release();
      }
      console.log('Base de datos inicializada correctamente');
      return pool;
    } catch (err) {
      retries++;
      console.log(`Intento ${retries} de ${maxRetries} fallido: ${err.message}`);
      if (retries >= maxRetries) {
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

function getDb() {
  return pool;
}

module.exports = { init, getDb };
