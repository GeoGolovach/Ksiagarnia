
import authService from '../services/authService.js';
// import { getAllBooks } from '../services/authService.js';

// export async function showHomePage(req, res, next) {
//         try {
//             const books = await getAllBooks();
//             res.render('glownastrona', { books, booksCard });
//         } catch (err) {
//             next(err);
//         }
//     }

 const registerUser = async (req, res, next) => {
        try {
            const newUser = await authService.createUser(req.body);
            res.redirect('/auth/login')
        }   catch (err) {
            next(err);
        }
    }


    function registrationForm(req, res) {
        res.render('zarejestrowanie');
    }

    const logoutUser = (req, res, next) => {
        req.session.destroy(err => {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    }

    function showLoginForm(req, res) {
        res.render('zalogowanie');
    }

    const loginUser = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await authService.authenticateUser(email, password);

            if (user) {
                req.session.user = {
                id: user.id,
                name: user.name,
                isAdmin: user.isAdmin,
                avatar_path: user.avatar_path,
            };

            req.session.save(err => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
            } else {
                res.status(401).render('zalogowanie', { 
                error: 'Nieprawidłowy email lub hasło.', // Неправильный email или пароль.
                success: null
            });
            }
        } catch (err) {
            next(err);
        }
    }

//     async login (req, res, next) {
//         const { email, password } = req.body;
//         try {
//             const user = await authService.authenticate(email, password);
//             if(!user) {
//                 return res.status(401).render('zalogowanie', { error: 'Invalid email or password' });
//             }
//             req.session.user = {
//                 id:       user.id,
//                 name:     user.name,
//                 email:    user.email,
//                 isAdmin:  user.isAdmin,
//                 phone:    user.phone,
//                 address:  user.address,
//                 filePath: user.avatar_path
//             }
//             res.redirect('/users/profile'); // Redirect to home page after successful login
//         }
//         catch (err) {
//             next(err); // Pass the error to the next middleware
//         }
//     },

//     logout(req, res, next) {
//         req.session.destroy(err => {
//         if (err) return next(err);
//             res.clearCookie('connect.sid');
//             res.json({ success: true });
//         });
//     }

// }
export default {
    registerUser,
    registrationForm,
    showLoginForm,
    loginUser,
    logoutUser,
};