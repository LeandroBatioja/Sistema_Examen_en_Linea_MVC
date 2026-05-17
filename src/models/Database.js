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

        const userResult = await client.query("SELECT id FROM users WHERE username = 'estudiante'");
        if (userResult.rows.length === 0) {
          const hash = bcrypt.hashSync('estudiante123', 10);
          await client.query(
            'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4)',
            ['estudiante', 'estudiante@universidad.edu', hash, 'Estudiante Demo']
          );
        }

        const seedExams = [
          {
            title: 'Examen de Fundamentos de Programacion',
            description: 'Evaluacion de conceptos basicos de programacion, algoritmos y estructuras de datos.',
            questions: [
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
            ]
          },
          {
            title: 'Examen de Base de Datos y SQL',
            description: 'Evaluacion sobre sistemas de bases de datos relacionales, consultas SQL y normalizacion.',
            questions: [
              ['Que es una base de datos relacional?', 'Un conjunto de datos organizados en tablas relacionadas', 'Un archivo de texto plano', 'Una hoja de calculo', 'Un sistema operativo', 'a'],
              ['Que significa la sigla SQL?', 'Structured Query Language', 'Simple Query Logic', 'Sequential Query Language', 'System Query Link', 'a'],
              ['Que comando SQL se usa para obtener datos de una tabla?', 'INSERT', 'UPDATE', 'SELECT', 'DELETE', 'c'],
              ['Que es una clave primaria (PRIMARY KEY)?', 'Un indice unico que identifica cada fila', 'Una clave para ordenar datos', 'Un tipo de dato especial', 'Una funcion de agregacion', 'a'],
              ['Que forma normal elimina las dependencias transitivas?', '1FN', '2FN', '3FN', '4FN', 'c'],
              ['Que clausula se usa para unir dos tablas en SQL?', 'MERGE', 'JOIN', 'COMBINE', 'UNION', 'b'],
              ['Que funcion de agregacion cuenta el numero de filas?', 'SUM', 'AVG', 'COUNT', 'MAX', 'c'],
              ['Que clausula filtra grupos en una consulta SQL?', 'WHERE', 'HAVING', 'FILTER', 'GROUP BY', 'b'],
              ['Que es una clave foranea (FOREIGN KEY)?', 'Una clave que referencia a la clave primaria de otra tabla', 'Una clave de cifrado', 'Un indice secundario', 'Una clave unica', 'a'],
              ['Que tipo de JOIN devuelve solo las filas que coinciden en ambas tablas?', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'c']
            ]
          },
          {
            title: 'Examen de Redes de Computadoras',
            description: 'Evaluacion sobre conceptos de redes, protocolos, direccionamiento y dispositivos de red.',
            questions: [
              ['Cuantas capas tiene el modelo OSI?', '4', '5', '7', '10', 'c'],
              ['Que protocolo se encarga de resolver nombres de dominio a direcciones IP?', 'DHCP', 'DNS', 'ARP', 'FTP', 'b'],
              ['Cual de las siguientes es una direccion IP privada?', '8.8.8.8', '10.0.0.1', '200.1.1.1', '192.1.1.1', 'b'],
              ['Que capa del modelo OSI se encarga del enrutamiento?', 'Capa de Enlace', 'Capa de Red', 'Capa de Transporte', 'Capa de Sesion', 'b'],
              ['Que protocolo de transporte es no orientado a conexion?', 'TCP', 'UDP', 'HTTP', 'FTP', 'b'],
              ['Que dispositivo se utiliza para conectar redes diferentes?', 'Switch', 'Hub', 'Router', 'Repetidor', 'c'],
              ['Que puerto utiliza el protocolo HTTP?', '21', '80', '443', '25', 'b'],
              ['Que es una direccion MAC?', 'Una direccion IP', 'Una direccion fisica de hardware', 'Una direccion de correo', 'Una direccion de red', 'b'],
              ['Que tecnologia Wi-Fi opera principalmente en la frecuencia de 5 GHz?', '802.11b', '802.11g', '802.11ac', '802.11n', 'c'],
              ['Que protocolo se usa para enviar correos electronicos?', 'HTTP', 'FTP', 'SMTP', 'SNMP', 'c']
            ]
          }
        ];

        for (const examData of seedExams) {
          const existing = await client.query('SELECT id FROM exams WHERE title = $1', [examData.title]);
          if (existing.rows.length === 0) {
            const examResult = await client.query(
              'INSERT INTO exams (title, description, time_limit_minutes, questions_per_page) VALUES ($1, $2, $3, $4) RETURNING id',
              [examData.title, examData.description, 30, 5]
            );
            const examId = examResult.rows[0].id;
            for (const q of examData.questions) {
              await client.query(
                'INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [examId, ...q]
              );
            }
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
