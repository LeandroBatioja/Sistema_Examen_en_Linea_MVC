const { getDb } = require('./Database');
const bcrypt = require('bcryptjs');

class User {
  static async create(username, email, password, fullName) {
    const db = getDb();
    const existing = await db.query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (existing.rows.length > 0) {
      return { success: false, error: 'El nombre de usuario o correo electronico ya existe' };
    }
    const hash = bcrypt.hashSync(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, email, hash, fullName]
    );
    return { success: true, id: result.rows[0].id };
  }

  static async authenticate(username, password) {
    const db = getDb();
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return { success: false, error: 'Usuario no encontrado' };
    }
    const user = result.rows[0];
    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return { success: false, error: 'Contrasena incorrecta' };
    }
    return { success: true, user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name } };
  }

  static async findById(id) {
    const db = getDb();
    const result = await db.query('SELECT id, username, email, full_name, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = User;
