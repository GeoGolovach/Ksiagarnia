import bookService from '../services/bookService.js';

export default {

    async searchBooks(req, res, next) {
        try {
            const { search } = req.body;
            const books = await bookService.searchBooks(search);
            res.json(books);

        } catch (err) {
            next(err);
        }

    },

    async filterBooksByViews(req, res, next) {
        try {
            const books = await bookService.filterBooksByViews();
            res.json(books);
        } catch (err) {
            next(err);
        }
    },

    async filterBooksBySuperprice(req, res, next) {
        try {
            const books = await bookService.filterBooksBySuperprice();
            res.json(books);
        } catch (err) {
            next(err);
        }
    },

    async filterBooksByPrice(req, res, next) {
        try {
            const books = await bookService.filterBooksByPrice();
            res.json(books);
        } catch (err) {
            next(err);
        }
    },

    async filterBooksByCategory(req, res, next) {
        try {
            const { category } = req.body;
            const books = await bookService.filterBooksByCategory(category);
            res.json(books || []); // Возвращаем пустой массив, если книг нет
        } catch (err) {
            next(err);
        }
    }



}
