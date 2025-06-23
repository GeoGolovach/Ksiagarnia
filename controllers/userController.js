 import userService from '../services/userService.js';

 export default {
    showProfile(req, res) {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.render('profile', { user: req.session.user });
    },

    async updateProfile(req, res, next) {
        try {
            const { name, email, phone, address} = req.body;

            const updatedUser = await userService.updateUser(req.session.user.id, name, email, phone, address);
            req.session.user = {...req.session.user, ...updatedUser}; // Обновляем сессию

            res.redirect('/users/profile');
        
        }   catch (err) {
            next(err);
        }
    },

    async uploadAvatar(req, res, next) {
        try {
            const filePath = `uploads/${req.file.filename}`;
            const updatedAvatar = await userService.updateAvatar(req.session.user.id, filePath);
            req.session.user.filePath = updatedAvatar;
            res.redirect('/users/profile');

        } catch (err) {
            next(err);
        }
    },

    async getOrders(req, res, next) {
        try {
            // вызов без лишнего аргумента
            const data = await userService.getOrders(req.session.user.id);
            // data = { orders: [...], books: [...] }
            res.json(data);
        } catch (err) {
            next(err);
        }
    },

    async removeFromOrders(req, res, next) {
        try {
            const  {bookId} = req.body;
            const userId = req.session.user.id;
            const result = await userService.removeOrder(userId, bookId);
            res.json({ success: result });

        } catch (err) { 
            next(err)
        }

    },

    async getWishlist(req, res, next) {
        try {
            const data = await userService.getWishlist(req.session.user.id);
            res.json(data);
        } catch (err) {
            next(err);
        }
    },

    async addToWishlist(req, res, next) {
        try {
            const { bookId } = req.body;
            const userId = req.session.user.id;
            const result = await userService.addToWishlist(userId, bookId);
            res.json({ success: result });
        } catch (err) {
            next(err);
        }
    },

    async removeFromWishlist(req, res, next) {
        try {
            const { bookId } = req.body;
            const userId = req.session.user.id;
            const result = await userService.removeFromWishlist(userId, bookId);
            res.json({ success: result });
        } catch (err) {
            next(err);
        }
    }, 

    async logout(req, res, next) {
        req.session.destroy(err => {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid'); // Очистка cookie сессии
            res.redirect('/'); // Перенаправление на главную страницу
        }
        )
    }
 }
