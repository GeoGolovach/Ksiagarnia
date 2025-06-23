import { filter } from "compression";
import { connection } from "../config/db.js";

export default {

    async searchBooks(search) {
        const term = `%${search}%`;
        const [books] = await connection.execute('SELECT * FROM books WHERE name LIKE ? OR author LIKE ? LIMIT 12', [term, term]);
        return books;
    },
     
    async filterBooksByViews() {
        const [books] = await connection.execute('SELECT * FROM books ORDER BY views DESC LIMIT 12');
        return books;
    },

    async filterBooksBySuperprice() {
        const [books] = await connection.execute('SELECT * FROM books WHERE superprice IS NOT NULL ORDER BY superprice DESC LIMIT 12');
        return books;
    },

    async filterBooksByPrice() {
        const [books] = await connection.execute('SELECT * FROM books ORDER BY COALESCE(superprice, price) ASC;');
        return books;
    },

    async filterBooksByCategory(category) {
        const [books] = await connection.execute('SELECT * FROM books WHERE genre = ? LIMIT 12', [category]);
        return books;
    },

}
