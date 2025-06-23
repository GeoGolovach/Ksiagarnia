// middlewares/errorHandler.js
import logger from '../config/logger.js';

export function errorHandler(err, req, res, next) {
  // Логируем всё через Winston:
  logger.error('❌ %s %s — %o', req.method, req.url, err);

  // Отдаём клиенту «красивую» страницу или JSON
  if (req.accepts('html')) {
    res.status(500).render('error', { message: 'Что-то пошло не так, попробуйте позже.' });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
