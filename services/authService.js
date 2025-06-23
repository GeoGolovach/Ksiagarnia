import { connection } from '../config/db.js';
import bcrypt from 'bcrypt';

export async function getAllBooks() {
  const [books] = await connection.query('SELECT * FROM books LIMIT 12');
  return books;
}

export default {

  async createUser(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
        'INSERT INTO users (name, email, password, avatar_path) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, 'uploads/avatar.png']
    );
    return { id: result.insertId, name, email, avatar_path: 'uploads/avatar.png' };
},

  async authenticate(email, password) {
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];
    if (!user) {
      return null; // User not found
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    return isMatch ? user : null
  }
}