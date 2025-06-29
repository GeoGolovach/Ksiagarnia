import { connection } from "../config/db.js";

class Orders {

    static async findOrdersByUser(userId) {
        const sql = 'SELECT * FROM orders WHERE user_id = ?';
        const [rows] = await connection.execute(sql, [userId]);
        return rows.map(row => row.book_id);
    }

    static async findByUserIdAndBookId(userId, bookId) {
        const sql = 'SELECT * FROM orders WHERE user_id = ? AND book_id = ?;';
        const [rows] = await connection.execute(sql, [userId, bookId]);
        return rows[0];
    }

    static async deleteFromOrders(userId, bookId) {
        const sql = 'DELETE FROM orders WHERE user_id = ? AND book_id = ?;';
        const [rows] = await connection.execute(sql, [userId, bookId]);
        return rows.affectedRows > 0;
    }
}

export default Orders;