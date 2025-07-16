import { connection } from '../config/db.js'

class Wishlist {

    static async addByUserIdAndBookId(userId, bookId) {
        const sql = 'INSERT INTO wishlist (user_id, book_id) VALUES (?, ?);';
        const [rows] = await connection.execute(sql, [userId, bookId]);
        return rows; 
    }

    static async findByUserIdAndBookId(userId, bookId) {
        const sql = 'SELECT * FROM wishlist WHERE user_id = ? AND book_id = ?;';
        const [rows] = await connection.execute(sql, [userId, bookId]);
        return rows[0];
    }

    static async findBookIdsByUser(userId) {
        const sql = 'SELECT * FROM wishlist WHERE user_id = ?;';
        const [rows] = await connection.execute(sql, [userId]);
        return rows.map(row => row.book_id);
    }

    static async deleteFromWishlist(userId, bookId) {
        const sql = 'DELETE FROM wishlist WHERE user_id = ? AND book_id = ?;';
        const [rows] = await connection.execute(sql, [userId, bookId]);
        return rows.affectedRows > 0;
    }
}

export default Wishlist;