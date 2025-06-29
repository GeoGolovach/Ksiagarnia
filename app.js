import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
import logger from './config/logger.js';

import sessionConfig from './config/session.js';
import { connection } from './config/db.js';

import { showHomePage } from './controllers/bookController.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import bookRoutes from './routes/books.js';

import { errorHandler } from './middlewares/errorHandler.js';

import compression from 'compression';

import path            from 'path';
import { fileURLToPath } from 'url';
import { attachUserData } from './middlewares/attachUserData.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
}

dotenv.config();

console.log("Текущий режим:", process.env.NODE_ENV);

app.use(express.static('public', { maxAge: '7d' }));
app.use('/uploads', express.static('uploads', { maxAge: '7d' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(attachUserData);

app.set('view engine', 'ejs');
app.set('views', './views');  // Указываем папку с шаблонами

app.use((req, res, next) => {
  logger.info('→ %s %s', req.method, req.url);
  next();
});

connection.getConnection()
    .then(conn => { console.log('DATABASE -------> START')
        conn.release();
    })   
    .catch(err => console.error('Database connection failed:', err));

app.get('/', showHomePage);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/books', bookRoutes);

app.use((err, req, res, next) => { console.error(err.stack); res.status(500).send('Внутренняя ошибка сервера'); });

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
