import { Router } from 'express';
import bookController from '../controllers/bookController.js';

const router = Router();

router.post('/search', bookController.searchBooks);
router.post('/filter', bookController.filterBooksByTop);
router.post('/filter-category', bookController.sortBooksByCategory)

export default router;
