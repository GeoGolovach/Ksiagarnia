import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Использовать secure cookie в продакшене
        sameSite: 'lax', // Защита от CSRF атак
        maxAge: 1000 * 60 * 60 * 24 // 1 день в миллисекундах
    }
};

export default sessionConfig;