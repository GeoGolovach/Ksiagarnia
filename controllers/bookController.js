import bookService from '../services/bookService.js';
import { booksCard } from '../public/js/booksCard.js';
import Wishlist from '../models/Wishlist.js';

    export const showHomePage = async (req, res, next) => {
        try{
            const page = req.query.page || 1;

            const pageData = await bookService.getBooksForPage(page);

            let wishlistBookIds = [];

            if (req.session.user) {
                wishlistBookIds = await Wishlist.findBookIdsByUser(req.session.user.id);
            }

            const wishlistJson = JSON.stringify(wishlistBookIds);

            res.render('glownastrona', { 
                user: req.session.user,
                books: pageData.books,
                currentPage: pageData.currentPage,
                totalPages: pageData.totalPages, 
                booksCard: booksCard,
                wishlist: new Set(wishlistBookIds),
                wishlistJson: wishlistJson
             });
        }   catch (err) {
            next(err);
        }    
    }

    const searchBooks = async (req, res, next) => {
        try {
            const param = req.body;

            const books = await bookService.searchBook(param);

            res.json(books);
        }   catch (err) {
            next(err);
        }
    }

    export default {
        searchBooks,
    }

// export default {

//     async searchBooks(req, res, next) {
//         try {
//             const { search } = req.body;
//             const books = await bookService.searchBooks(search);
//             res.json(books);

//         } catch (err) {
//             next(err);
//         }

//     },

//     async filterBooksByViews(req, res, next) {
//         try {
//             const books = await bookService.filterBooksByViews();
//             res.json(books);
//         } catch (err) {
//             next(err);
//         }
//     },

//     async filterBooksBySuperprice(req, res, next) {
//         try {
//             const books = await bookService.filterBooksBySuperprice();
//             res.json(books);
//         } catch (err) {
//             next(err);
//         }
//     },

//     async filterBooksByPrice(req, res, next) {
//         try {
//             const books = await bookService.filterBooksByPrice();
//             res.json(books);
//         } catch (err) {
//             next(err);
//         }
//     },

//     async filterBooksByCategory(req, res, next) {
//         try {
//             const { category } = req.body;
//             const books = await bookService.filterBooksByCategory(category);
//             res.json(books || []); // Возвращаем пустой массив, если книг нет
//         } catch (err) {
//             next(err);
//         }
//     }



// }
