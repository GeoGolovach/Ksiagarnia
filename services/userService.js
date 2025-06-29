import Book from '../models/Book.js';
import Orders from '../models/Orders.js';
import User from '../models/User.js'
import Wishlist from '../models/Wishlist.js';

 const updateUser = async (userId, dataToUpdate) => {
    try {

        if (dataToUpdate.email) {
            const userEmail = await User.findByEmail(dataToUpdate.email);
            if (userEmail && userEmail.id !== userId) {
                throw new Error;
            }
        }
        
        await User.update(userId,  dataToUpdate);
        
        return User.findById(userId);
    }   catch (err) {
        throw err;
    }
 }

 const getWishlist = async (userId) => {
    try {
        const bookIdsFromWishlist = await Wishlist.findBookIdsByUser(userId);

        if (bookIdsFromWishlist.length === 0) {
        return []; 
    }
        const placeholders = bookIdsFromWishlist.map(() => '?').join(', ');
        const booksFromUser = await Book.findBooksByArray(bookIdsFromWishlist, placeholders);
        return booksFromUser;
        
    }   catch(err) {
        throw err;
    }
 }

 const getOrders = async (userId) => {
    try {
        const booksIdsFromOrders = await Orders.findOrdersByUser(userId);

        if (booksIdsFromOrders) {
            return [];
        }

        const placeholders = booksIdsFromOrders.map(() => '?').join(', ');
        const booksFromOrders = await Book.findBooksByArray(booksIdsFromOrders, placeholders);
        return booksFromOrders;

    }   catch(err) {
        throw err;
    }
 }

 const addBookToWishlist = async (userId, bookId) => {
    
    const tryToFind = await Wishlist.findByUserIdAndBookId(userId, bookId);

    if (tryToFind) {
        await Wishlist.deleteFromWishlist(userId, bookId);
        return { status: 'delete' };
    }  else {
        await Wishlist.addByUserIdAndBookId(userId, bookId);
        return { status: 'added' };
    } 

 }

 const deleteBookFromWishlist = async (userId, bookId) => {
    try {
        const tryToFind = await Wishlist.findByUserIdAndBookId(userId, bookId);

        if (tryToFind) {
            await Wishlist.deleteFromWishlist(userId,bookId);
            return { success: true, status: 'removed' };
        }   else {
            return { success: true, status: 'not_found' };
        }

    }   catch(err) {
        throw err;
    }
}

 const deleteBookFromOrders = async (userId, bookId) => {
    try {
        const tryToFindOrder = await Orders.findByUserIdAndBookId(userId, bookId);

        if (tryToFindOrder) {
            await Orders.deleteFromOrders(userId, bookId);
            return { success: true, status: 'removed' };
        }   else {
            return { success: true, status: 'not_found' }
        }
    }   catch(err) {
        throw err;
    }
 }

 export default {
    updateUser,
    addBookToWishlist,
    getWishlist,
    getOrders,
    deleteBookFromWishlist,
    
 }

//  export default {

//     async updateUser( userId, name, email, phone, address) {

//         const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
//         const currentUser = rows[0];

//         name = name || currentUser.name;
//         email = email || currentUser.email;
//         phone = phone || currentUser.phone;
//         address = address || currentUser.address;

//         await connection.execute('UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone), address = COALESCE(?, address) WHERE id =?', [name, email, phone, address, userId]);

//         return { name, email, phone, address };
//     },

//     async updateAvatar(userId, filePath) {
//         const [rows] = await connection.execute('SELECT avatar_path FROM users WHERE id = ?', [userId]);
//         const oldAvatar = rows[0].avatar_path;

//         if (oldAvatar !== filePath) {
//             const defaultPath = 'uploads/avatar.png';
//             await connection.execute('UPDATE users SET avatar_path = ? WHERE id = ?', [filePath, userId]);
//             if (oldAvatar !== defaultPath) {
//             const fullOldPath = path.join(process.cwd(), oldAvatar);
//             await fs.unlink(fullOldPath);
//             }
//         }
//        return filePath;

//     },

//     async getOrders(userId) {
//         // 1) Получаем все записи из orders
//         const [orderRows] = await connection.execute(
//             'SELECT id AS order_id, book_id FROM orders WHERE user_id = ?',
//             [userId]
//         );
//         // Если нет заказов — сразу возвращаем пустышки
//         if (!orderRows.length) {
//             return { orders: [], books: [] };
//         }

//         // 2) Собираем все book_id
//         const bookIds = orderRows.map(r => r.book_id);
//         const placeholders = bookIds.map(() => '?').join(',');
        
//         // 3) Выбираем все книги одним запросом
//         const [bookRows] = await connection.execute(
//             `SELECT * FROM books WHERE id IN (${placeholders})`,
//             bookIds
//         );
//         // 4) Возвращаем объект нужного формата
//         return {
//             orders: orderRows,  // [{ order_id, book_id }, …]
//             books:   bookRows   // [{ id, title, author, … }, …]
//         };
//     },

//     async removeOrder(userId, bookId) {
//         const [results] = await connection.execute('DELETE FROM orders WHERE user_id = ? AND book_id = ?', [userId, bookId]);
//         console.log('Удалено заказов:', results.affectedRows);
//         if (results.affectedRows === 0) {
//             return false; 
//         }
//         return true;
//     },

//     async getWishlist(userId) {
//         const [wishlistRows] = await connection.execute('SELECT id AS wishlist_id, book_id FROM wishlist WHERE user_id = ?', [userId]);
//         if(!wishlistRows.length) {
//             return { wishlist: [], books: [] };
//         }

//         const bookIds = wishlistRows.map(r => r.book_id);
//         const placeholders = bookIds.map(() => '?').join(',');

//         const [booksFromWishlist] = await connection.execute(`SELECT * FROM books WHERE id IN (${placeholders})`, bookIds);

//         return {
//             wishlist: wishlistRows,  // [{ wishlist_id, book_id }, …]
//             books: booksFromWishlist  // [{ id, title, author, … }, …]
//         };
//     },

//     async addToWishlist(userId, bookId) {
//         const [results] = await connection.execute('INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)', [userId, bookId]);
//         console.log('Добавлено в избранное:', results.affectedRows);
//         if (results.affectedRows === 0) {
//             return false; 
//         }
//         return true;
//     },

//     async removeFromWishlist(userId, bookId) {
//         const [results] = await connection.execute('DELETE FROM wishlist WHERE user_id = ? and book_id = ?', [userId, bookId]);
//         console.log('Удалено из избранного:', results.affectedRows);
//         if (results.affectedRows === 0) {
//             return false; 
//         }
//         return true;
//     },

//  }
