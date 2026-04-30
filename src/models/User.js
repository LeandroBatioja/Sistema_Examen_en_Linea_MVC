const { getDb } = require('./Database');
const bcrypt = require('bcryptjs');

class User {
  static create(username, email, password, fullName) {
    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
    if (existing) {
      return { success: false, error: 'El nombre de usuario o correo electronico ya existe' };
    }
    const hash = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)'
    ).run(username, email, hash, fullName);
    return { success: true, id: result.lastInsertRowid };
  }

  static authenticate(username, password) {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }
    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return { success: false, error: 'Contrasena incorrecta' };
    }
    return { success: true, user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name } };
  }

  static findById(id) {
    const db = getDb();
    return db.prepare('SELECT id, username, email, full_name, created_at FROM users WHERE id = ?').get(id);
  }
}

module.exports = User;
