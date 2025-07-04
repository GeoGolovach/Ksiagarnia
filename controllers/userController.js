 import userService from '../services/userService.js';
 import User from '../models/User.js';
 import { attachUserData } from '../middlewares/attachUserData.js';


 async function showProfile(req, res) {
       try {
        const allDataAboutUser = await User.findById(req.userId);

        res.render('profile', {
              user: allDataAboutUser,
              success: null,
              error: null
        })
       } catch (err) {
              next(err);
       }
 }

 const updateProfile = async (req, res, next) => {
       try {
              const userId = req.session.user.id;
              const dataToUpdate = req.body;
              const updatedUser = await userService.updateUser(userId, dataToUpdate);

              req.session.user = {...req.session.user, ...updatedUser};

              res.redirect('/users/profile')
       } catch (err) {
              next(err);
       }
}

const uploadAvatar = async (req, res, next) => {
       try {
        
        if (!req.file) {
            
            return res.redirect('/users/profile?error=upload_failed');
        }
   
        const filePath = `uploads/${req.file.filename}`;
    
        const updatedUser = await userService.updateAvatar(req.userId, filePath);
   
        req.session.user.avatar_path = updatedUser.avatar_path;

        req.session.save(err => {
            if (err) return next(err);
            res.redirect('/users/profile?status=avatar_updated');
        });

    } catch (err) {
        next(err);
    }
}

const addToWishlist = async (req, res, next) => {
       try {
              const userId = req.session.user.id;
              const { bookId } = req.body;

              if (!bookId) {
                     return res.status(400).json({ success: false, message: 'bookId is required' });
              }

              const result = await userService.addBookToWishlist(userId, parseInt(bookId, 10));

              res.json({success: true, ...result});

       } catch(err) {
              next(err);
       }
}

const getUserWishlist = async (req, res, next) => {
       try {
              const userId = req.session.user.id;
              const booksFromWishlist = await userService.getWishlist(userId);
              res.json(booksFromWishlist);
       } catch (err) {
              next(err);
       }
}

const getUserOrders = async (req, res, next) => {
       try {
              const userId = req.session.user.id;
              const booksFromOrders = await userService.getOrders(userId);
              res.json(booksFromOrders);
       }      catch(err) {
              next(err);
       }
}

const deleteFromWishlist = async (req, res, next) => {
       try {
              const { bookId } = req.body;
              const result = await userService.deleteBookFromWishlist(req.userId, bookId);
              res.json(result);
       }      catch(err) {
              next(err);
       }
}

const deleteFromOrders = async (req, res, next) => {
       try {
              const { bookId } = req.body;
              const result = await userService.deleteBookFromOrders(req.userId, bookId);
              res.json(result);
       }      catch(err) {
              next(err);
       }
}

 export default {
        showProfile,
        updateProfile,
        addToWishlist,
        getUserWishlist,
        getUserOrders,
        deleteFromWishlist,
        deleteFromOrders,
        uploadAvatar,

 }

//  export default {
//     showProfile(req, res) {
//         if (!req.session.user) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//         res.render('profile', { user: req.session.user });
//     },

//     async updateProfile(req, res, next) {
//         try {
//             const { name, email, phone, address} = req.body;

//             const updatedUser = await userService.updateUser(req.session.user.id, name, email, phone, address);
//             req.session.user = {...req.session.user, ...updatedUser}; // Обновляем сессию

//             res.redirect('/users/profile');
        
//         }   catch (err) {
//             next(err);
//         }
//     },

//     async uploadAvatar(req, res, next) {
//         try {
//             const filePath = `uploads/${req.file.filename}`;
//             const updatedAvatar = await userService.updateAvatar(req.session.user.id, filePath);
//             req.session.user.filePath = updatedAvatar;
//             res.redirect('/users/profile');

//         } catch (err) {
//             next(err);
//         }
//     },

//     async getOrders(req, res, next) {
//         try {
//             // вызов без лишнего аргумента
//             const data = await userService.getOrders(req.session.user.id);
//             // data = { orders: [...], books: [...] }
//             res.json(data);
//         } catch (err) {
//             next(err);
//         }
//     },

//     async removeFromOrders(req, res, next) {
//         try {
//             const  {bookId} = req.body;
//             const userId = req.session.user.id;
//             const result = await userService.removeOrder(userId, bookId);
//             res.json({ success: result });

//         } catch (err) { 
//             next(err)
//         }

//     },

//     async getWishlist(req, res, next) {
//         try {
//             const data = await userService.getWishlist(req.session.user.id);
//             res.json(data);
//         } catch (err) {
//             next(err);
//         }
//     },

//     async addToWishlist(req, res, next) {
//         try {
//             const { bookId } = req.body;
//             const userId = req.session.user.id;
//             const result = await userService.addToWishlist(userId, bookId);
//             res.json({ success: result });
//         } catch (err) {
//             next(err);
//         }
//     },

//     async removeFromWishlist(req, res, next) {
//         try {
//             const { bookId } = req.body;
//             const userId = req.session.user.id;
//             const result = await userService.removeFromWishlist(userId, bookId);
//             res.json({ success: result });
//         } catch (err) {
//             next(err);
//         }
//     }, 

//     async logout(req, res, next) {
//         req.session.destroy(err => {
//             if (err) {
//                 return next(err);
//             }
//             res.clearCookie('connect.sid'); // Очистка cookie сессии
//             res.redirect('/'); // Перенаправление на главную страницу
//         }
//         )
//     }
//  }
