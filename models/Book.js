import { connection } from "../config/db.js";

class Book {
    constructor(book) {
        this.id = book.id;
        this.name = book.name;
        this.author = book.author;
        this.description = book.description;
        this.imageUrl = book.imageUrl;
        this.link = book.link;
        this.created_at = book.created_at;
        this.price = book.price;
        this.genre = book.genre;
        this.views = book.views;
        this.superprice = book.superprice;
    }

    // --- Статические методы для работы с базой данных ---

    /**
     * Находит определенное количество книг со смещением (для пагинации)
     * и считает общее количество книг.
     * @param {object} options - Опции с limit и offset.
     * @param {number} options.limit - Сколько книг получить (наш размер страницы, т.е. 12).
     * @param {number} options.offset - Сколько книг пропустить с начала.
     * @returns {Promise<{books: Book[], totalCount: number}>} - Возвращает массив книг для страницы и общее количество.
     */

     static async findAndCountAll({ limit, offset }) {
        const booksSql = 'SELECT * FROM books ORDER BY created_at DESC LIMIT ? OFFSET ?;';
        const [books] = await connection.execute(booksSql, [limit, offset]);
        const countSql = 'SELECT COUNT(*) AS totalCount FROM books;';
        const [countRows] = await connection.execute(countSql);
        return {
            books: books.map(bookData => new Book(bookData)),
            totalCount: countRows[0].totalCount
        };
    }
    /**
     * Находит книгу по ID.
     * @param {number} id 
     * @returns {Promise<Book|null>}
     */

    static async findById(id) {
        const sql = 'SELECT * FROM books WHERE id = ?;';
        const [rows] = await connection.execute(sql, [id]);
        if (rows.length === 0) {
            return null;
        }
        return new Book(rows[0]);
    }

    static async findBooksByArray(bookIdsFromWishlistOrOrders, placeholders) {
        const sql = `SELECT * FROM books WHERE id IN (${placeholders});`;
        const [rows] = await connection.execute(sql, bookIdsFromWishlistOrOrders);
        if (rows.length === 0) {
            return null;
        }
        return rows.map(bookData => new Book(bookData));
    }

    /**
     * 
     * @param {param} param
     * @returns {Promise<Book|null>} 
     */

    static async findByAuthorAndName(lowValues) {
        const term = `%${lowValues}%`;
        console.log(lowValues)
        const sql = 'SELECT * FROM books WHERE name LIKE ? OR author LIKE ?';
        const [rows] = await connection.execute(sql, [term, term]);
        return rows;
    }

    static async filterByTop({ sortBy, sortOrder }, limit, offset) {
        if (!sortBy || !sortOrder) {
            return { books: [], totalCount: 0 };
        }
        const validSortBy = ['views', 'price', 'superprice']; // Белый список колонок
        if (!validSortBy.includes(sortBy)) {
             throw new Error("Invalid sort column");
        }
        const validSortOrder = ['ASC', 'DESC']; // Белый список направлений
         if (!validSortOrder.includes(sortOrder.toUpperCase())) {
             throw new Error("Invalid sort order");
        }

        const countSql = `SELECT COUNT(*) AS totalCount FROM books;`;
        const [countRows] = await connection.execute(countSql);
        const totalCount = countRows[0].totalCount;

        const booksSql = `SELECT * FROM books ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?;`;
        const [books] = await connection.execute(booksSql, [limit, offset]);
        
        return { books, totalCount };
    }

    static async sortByCategory(category, limit, offset) {
        if (!category) {
            return { books: [], totalCount: 0 };
        }
        const countSql = `SELECT COUNT(*) AS totalCount FROM books WHERE genre = ?;`;
        const [countRows] = await connection.execute(countSql, [category]);
        const totalCount = countRows[0].totalCount;

        const booksSql = `SELECT * FROM books WHERE genre = ? LIMIT ? OFFSET ?;`;
        const [books] = await connection.execute(booksSql, [category, limit, offset]);
        
        return { books, totalCount };
    }
}

export default Book;