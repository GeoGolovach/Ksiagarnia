import { booksCard } from '../public/js/booksCard.js';
import authService from '../services/authService.js';
import { getAllBooks } from '../services/authService.js';

export async function showHomePage(req, res, next) {
        try {
            const books = await getAllBooks();
            res.render('glownastrona', { books, booksCard });
        } catch (err) {
            next(err);
        }
    }

export default {

    registrationForm(req, res) {
        res.render('zarejestrowanie');
    },

    async registerUser(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const user = await authService.createUser(name, email, password);
            req.session.user = user;
            res.status(201).json({ message: 'User registered successfully', user });
        }   catch (err) {
            next(err);
        }
    },

    showHomePage(req, res) {
        res.render('glownastrona');
    },

    showLoginForm(req, res) {
        res.render('zalogowanie');
    },

    async login (req, res, next) {
        const { email, password } = req.body;
        try {
            const user = await authService.authenticate(email, password);
            if(!user) {
                return res.status(401).render('zalogowanie', { error: 'Invalid email or password' });
            }
            req.session.user = {
                id:       user.id,
                name:     user.name,
                email:    user.email,
                isAdmin:  user.isAdmin,
                phone:    user.phone,
                address:  user.address,
                filePath: user.avatar_path
            }
            res.redirect('/users/profile'); // Redirect to home page after successful login
        }
        catch (err) {
            next(err); // Pass the error to the next middleware
        }
    },

    logout(req, res, next) {
        req.session.destroy(err => {
        if (err) return next(err);
            res.clearCookie('connect.sid');
            res.json({ success: true });
        });
    }

}
