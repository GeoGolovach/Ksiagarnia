import { filter } from "compression";
import Book from "../models/Book.js";

/**
 * Получает данные для определенной страницы с книгами.
 * @param {number} page - Номер страницы, который мы хотим получить.
 * @returns {Promise<object>} - Объект с книгами, текущей страницей и общим количеством страниц.
 */

const PAGE_SIZE = 12;

const getBooksForPage = async (page = 1) => {
    const currentPage = Math.max(1, parseInt(page, 10));
    const offset = (currentPage - 1) * PAGE_SIZE;

    const { books, totalCount } = await Book.findAndCountAll({
        limit: PAGE_SIZE,
        offset: offset
    });

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { books, currentPage, totalPages };
};

const searchBook = async (param) => {
    
    const values = Object.values(param);
    const lowValues = values[0].toLowerCase();

    const books = await Book.findByAuthorAndName(lowValues);
    return books;
}

const sortBooksByCategories = async (category, page = 1) => {
    const currentPage = Math.max(1, parseInt(page, 10));
    const offset = (currentPage - 1) * PAGE_SIZE;

    const { books, totalCount } = await Book.sortByCategory(category, PAGE_SIZE, offset);
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { books, currentPage, totalPages };
}

const filterBooksByTop = async (filterOptions) => {
    const { page = 1, ...options } = filterOptions;
    const currentPage = Math.max(1, parseInt(page, 10));
    const offset = (currentPage - 1) * PAGE_SIZE;

    const { books, totalCount } = await Book.filterByTop(options, PAGE_SIZE, offset);
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { books, currentPage, totalPages };
}

export default {
    getBooksForPage,
    searchBook,
    sortBooksByCategories,
    filterBooksByTop,
}

// export default {

//     async searchBooks(search) {
//         const term = `%${search}%`;
//         const [books] = await connection.execute('SELECT * FROM books WHERE name LIKE ? OR author LIKE ? LIMIT 12', [term, term]);
//         return books;
//     },
     
//     async filterBooksByViews() {
//         const [books] = await connection.execute('SELECT * FROM books ORDER BY views DESC LIMIT 12');
//         return books;
//     },

//     async filterBooksBySuperprice() {
//         const [books] = await connection.execute('SELECT * FROM books WHERE superprice IS NOT NULL ORDER BY superprice DESC LIMIT 12');
//         return books;
//     },

//     async filterBooksByPrice() {
//         const [books] = await connection.execute('SELECT * FROM books ORDER BY COALESCE(superprice, price) ASC;');
//         return books;
//     },

//     async filterBooksByCategory(category) {
//         const [books] = await connection.execute('SELECT * FROM books WHERE genre = ? LIMIT 12', [category]);
//         return books;
//     },

// }
