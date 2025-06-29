import { Router } from 'express';
import bookController from '../controllers/bookController.js';

const router = Router();

router.post('/search', bookController.searchBooks);
// router.post('/postBooksByViews', bookController.filterBooksByViews);
// router.post('/postBooksBySuperprice', bookController.filterBooksBySuperprice);
// router.post('/postBooksByPrice', bookController.filterBooksByPrice);
// router.post('/postBooksByCategory', bookController.filterBooksByCategory);

export default router;
