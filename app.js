import express from 'express';
import mysql from 'mysql2';
import bcrypt  from 'bcrypt';
import session from 'express-session';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
const app = express();

app.use(cors());

// Функция для создания подключения с задержкой
async function connectWithDelay() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            connection.connect(err => {
                if (err) {
                    return reject(err);
                }
                console.log('DATABASE -------> START');
                resolve();
            });
        }, 5000); // Задержка 5 секунд
    });
}

// Настройка подключения к БД
const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: '',
    database: 'book_shop'
});

// Подключение к базе данных с задержкой
connectWithDelay().catch(err => {
    console.error('Ошибка подключения к базе данных:', err);
});

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'));

app.use(session({
    secret: '8hD$3pQ!tV@9xW&7zJ*2kR#5fL%1mN^4y',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 день в миллисекундах
    }
}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Уникальное имя файла
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/; // Разрешенные типы файлов
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Ошибка: Неподдерживаемый тип файла!'));
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 4 * 1024 * 1024}, // Ограничение на размер файла (4 МБ)
    fileFilter: fileFilter
});

// Функции, методы и пути

async function getBooksByGenre(genre) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM books WHERE genre = ? ORDER BY name ASC;', [genre], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

async function getBooks(page = 1, limit = 15) {
    const offset = (page - 1) * limit;
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM books LIMIT ?, ?', [offset, limit], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

async function getUsers() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users', (err, result) => {
            if (err) {
                return reject(err);
            }   else {
                resolve(result);
            }
        });
    });
}

async function getBookById(id) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM books WHERE id = ?;', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]); // Возвращаем первую книгу
        });
    });
}

async function getOrdersByUserId(userId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM orders WHERE user_id = ?;', [userId], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

async function getWishlistByUserId(userId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM wishlist WHERE user_id = ?;', [userId], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

async function getBooksByIds(bookIds) {
    if (!bookIds.length) {
        return []; // Возвращаем пустой массив, если bookIds пустой
    }

    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM books WHERE id IN (?);', [bookIds], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}



app.get('/', async (req, res) => {
    const page = req.query.page || 1;
    try {
        const books = await getBooks(page);
        const user = req.session.user || null; // Получаем информацию о пользователе из сессии
        res.render('glownastrona', { books, user, currentPage: page });
    }catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/search', async (req, res) => {
    const search = req.body.search;
    try {
        connection.query('SELECT * FROM books WHERE name LIKE ? OR author LIKE ?;', [`%${search}%`, `%${search}%`], (err, results) => {
            if (err) {
                console.log(err);
            }   else {
                res.json(results);
            }
        })
    }
    catch (error) {
        console.error('Ошибка поиска книг:', error);
        res.status(500).send('Ошибка поиска книг');
    }
});

app.get('/zalogowanie', (req, res) => {
    res.render('zalogowanie')
});

app.get('/zarejestrowanie', (req, res) => {
    res.render('zarejestrowanie')
});

app.get('/book1/:id', async (req, res) => {
    const bookId = req.params.id;
    const user = req.session.user || null;
    if (!user) {
        return res.render('zalogowanie');
    } else {
        try {
            const book = await getBookById(bookId);
            if (book) {
                const similarBooks = await getBooksByGenre(book.genre);
                res.render('book1', { book, user, similarBooks });
            } else {
                res.status(404).send('Книга не найдена');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Ошибка сервера');
        }
    }
});

app.get('/admin', (req, res) => {
    const user = req.session.user || null;
    if (!user) {
        return res.redirect('/zalogowanie');
    }   else if (!user.isAdmin) {
        return res.status(403).send('Доступ запрещен');
    }   else {
        res.render('admin', { user });
    }
})

app.get('/autors', (req, res) => {
    const user = req.session.user || null;
    if (!user) {
        return res.redirect('/zalogowanie');
    }   else {
        res.render('autors', { user });
    }
});

app.post('/data-form-logowanie', (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let sql2 = `SELECT * FROM users WHERE email = ?;`;
    connection.query(sql2, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('server error');
        }

        if (result.length === 0) {
            console.log('Email not found');
            return res.status(401).send('Error email or password. You need to register');
        }   else {
            const hash = result[0].password;
            const isAdmin  = result[0].isAdmin;

            bcrypt.compare(password, hash, (err, match) => {
                if (err) {
                    console.error('Error DB', err);
                    return res.status(500).send('Error server');
                }
    
                if (match) {
                    console.log('OK');

                    req.session.user = {
                        id: result[0].id,
                        name : result[0].name,
                        email: result[0].email,
                        isAdmin: isAdmin,
                        phone: result[0].phone,
                        address: result[0].address,
                        filePath: result[0].avatar_path
                    };

                    if (isAdmin) {
                        return res.redirect('/admin');
                    }   else {
                        console.log(req.session.user);
                        return res.redirect('/');
                        
                    }
                    
                } else {
                    console.log('Error password');
                    return res.redirect('/zalogowanie')
                }
            });
        }
    });
});

app.post('/data-form-rejestrowanie', (req, res) => {
    const table = 'users';
    let name = req.body.name
    let lastName = req.body.lastName
    let email = req.body.email
    let password = req.body.password

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return console.error('Error #password:', err);
        }
        console.log('Password complited:', hash);

        let sql = `INSERT INTO users (name, lastname, email, password) VALUES ( ?, ?, ?, ? );`;
        
        connection.query(sql, [name, lastName, email, hash], (err, result) => {
            if (err) {
                console.log(err);
            }   else {
                req.session.user = {
                    id: result.insertId,
                    name : name,
                    email: email,
                    isAdmin: false
                };
                
                console.log('one person INSERT INTO users');
                return res.redirect('/');
            }
    
        });
        
    })
    });
    
    app.post('/add-book', (req, res) => {
        const { name, author, description, imageUrl, link } = req.body;
        
        const newBook = new Book(name, author, description, imageUrl, link);
        
        let sql3 = `INSERT INTO books (name, author, description, imageUrl, link) VALUES (?, ?, ?, ?, ?);`;
        connection.query(sql3, [name, author, description, imageUrl, link], (err, result) => {
            if (err) {
                console.log(err);
            }   else {
                console.log('one book INSERT INTO books');
                // Добавляем новую книгу в массив books
            books.push(newBook); // Предполагается, что books - это массив
            console.log('Книга добавлена');
            return res.status(201).json({ message: 'Книга добавлена', book: newBook });
            }
        })
    });

    app.delete('/delete-book', (req, res) => {
        const { name, author } = req.body;
    
        let sql4 = `DELETE FROM books WHERE name = ? AND author = ?;`

        connection.query(sql4, [name, author], (err, result) => {
            if (err) {
                console.log(err);
            }   else {
                console.log('Книги удалена из БД');
            }
        })
        
    
    
        res.json({ message: 'Книга удалена', name, author });
    });

    app.get('/admin/books', (req, res) => {
        getBooks()
            .then(books => res.json(books))
            .catch(err => {
                console.error(err);
                res.status(500).send('Ошибка сервера');
            });
    });
    
    // Получение всех пользователей
    app.get('/admin/users', (req, res) => {
        getUsers()
            .then(users => res.json(users))
            .catch(err => {
                console.error(err);
                res.status(500).send('Ошибка сервера');
            });
    });

app.get('/profile', async (req, res) => {
    const user = req.session.user || null;
    if (!user) {
        return res.redirect('/zalogowanie');
    }
    
    try {
        const orders = await getOrdersByUserId(user.id);
        const bookIds = orders.map(order => order.book_id);
        const books = await getBooksByIds(bookIds);
        const wishlist = await getWishlistByUserId(user.id);
        
        // Передаем в шаблон как orders, так и books
        res.render('profile', { user, orders, books, wishlist});
    } catch (error) {
        console.log('Заказов нет');
        res.render('profile', { user, orders: [], books: [], wishlist: []});
    }
});

app.get('/orders', async (req, res) => {
    const user = req.session.user || null;
    if (!user) {
        return res.redirect('/zalogowanie');
    }
    
    try {
        const orders = await getOrdersByUserId(user.id);
        
        // Проверяем, есть ли заказы
        if (!orders.length) {
            console.log(orders.length);
            console.log({ orders: [], books: [] });
            return res.json({ orders: [], books: [] });
        }
        
        const bookIds = orders.map(order => order.book_id);
        const books = await getBooksByIds(bookIds);
        
        console.log(orders, books, user.id);
        res.json({ orders, books });
    } catch (error) {
        console.error('Ошибка получения заказов:', error);
        res.status(500).send('Ошибка получения заказов');
    }
});

app.get('/wishlist', async (req, res) => {
    const user = req.session.user || null;
    if (!user) {
        return res.redirect('/zalogowanie');
    }   else {
        try {
            const wishlist = await getWishlistByUserId(user.id);
            const bookIds = wishlist.map(wish => wish.book_id);
            const books = await getBooksByIds(bookIds);
            res.json({ user, wishlist, books });
        }
        catch (error) {
            console.error('Ошибка получения списка желаемого:', error);
            res.status(500).send('Ошибка получения списка желаемого');
        }

    }
})

app.post('/orders/add-to-cart', async (req, res) => {
    const { bookId } = req.body;
    const user = req.session.user; // Получаем текущего пользователя

    if (!user) {
        return res.status(401).send('Пожалуйста, войдите в систему'); // Неавторизованный доступ
    }

    const userId = user.id; // Получаем ID текущего пользователя

    try {
        connection.query('SELECT * FROM orders WHERE user_id = ? AND book_id = ?;', [userId, bookId], (err, results) => { // Проверяем, есть ли уже такая книга в корзине
            if (err) {
                console.error(err);
                return res.status(500).send('Ошибка добавления заказа');
            }

            if (results.length) {
                return res.status(400).send('Книга уже добавлена в корзину');
            }

            connection.query('UPDATE books SET views = views + 1 WHERE id = ?;', [bookId], (err, result) => { // Увеличиваем количество просмотров книги
                if (err) {
                    console.error(err);
                    return res.status(500).send('Ошибка добавления заказа');
                }

                console.log('Количество просмотров увеличено на 1');

                const sql = 'INSERT INTO orders (user_id, book_id) VALUES (?, ?);';
                connection.query(sql, [userId, bookId], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Ошибка добавления заказа');
            }
            res.send('Книга добавлена в корзину'); // Успешное сообщение
            
        });
            });

        });

    } catch (error) {
        res.status(500).send('Ошибка добавления заказа');
    }
});

app.post('/wishlist/add-to-wishlist', async (req, res) => {
    const { bookId } = req.body;
    const user = req.session.user; // Получаем текущего пользователя

    if (!user) {
        return res.status(401).send('Пожалуйста, войдите в систему'); // Неавторизованный доступ
    }   else {
        const userId = user.id;
        try {
            const sql = 'INSERT INTO wishlist (user_id, book_id) VALUES (?, ?);';
            connection.query(sql, [userId, bookId], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Ошибка добавления в список желаемого');
                }
                console.log('Книга добавлена в список желаемого');
                res.send('Книга добавлена в список желаемого');
            })
        }
        catch (error) {
            res.status(500).send('Ошибка добавления в список желаемого');
        }
    }

})

app.post('/wishlist/remove-from-wishlist', async (req, res) => {
    const { bookId } = req.body;
    const user = req.session.user; // Получаем текущего пользователя

    if (!user) {
        return res.status(401).send('Пожалуйста, войдите в систему'); // Неавторизованный доступ
    }   else {
        const userId = user.id;
        try {
            const sql = 'DELETE FROM wishlist WHERE user_id = ? AND book_id = ?;';
            connection.query(sql, [userId, bookId], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Ошибка удаления из списка желаемого');
                }
                console.log('Книга удалена из списка желаемого');
                res.json({ success: true, message: 'Книга удалена из списка желаемого' });
            })
        }
        catch (error) {
            res.status(500).send('Ошибка удаления из списка желаемого');
        }
    }
});

app.post('/orders/remove-from-orders', async (req, res) => {
    const { bookId } = req.body;
    const user = req.session.user; // Получаем текущего пользователя

    if (!user) {
        return res.status(401).send('Пожалуйста, войдите в систему'); // Неавторизованный доступ
    }   else {
        const userId = user.id;
        try {
            const sql = 'DELETE FROM orders WHERE user_id = ? AND book_id = ?;';
            connection.query(sql, [userId, bookId], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Ошибка удаления из корзины');
                }
                console.log('Книга удалена из корзины');
                res.json({ success: true, message: 'Книга удалена из корзины' });
            })
        }
        catch (error) {
            res.status(500).send('Ошибка удаления из корзины');
        }
    }
});

// Изменения профиля и обновление данных

app.post('/update-profile', async (req, res) => {
    const { username, email, phone, address } = req.body;
    const user = req.session.user; // Получаем текущего пользователя

    if (!user) {
        return res.status(401).send('Пожалуйста, войдите в систему'); // Неавторизованный доступ
    }

    const userId = user.id;

    // Создаем массив для хранения обновлений
    const updates = [];
    const values = [];

    // Проверка и добавление обновлений для каждого поля
    if (username) {
        updates.push('name = ?');
        values.push(username);
    }
    if (email) {
        updates.push('email = ?');
        values.push(email);
    }
    if (phone) {
        updates.push('phone = ?');
        values.push(phone);
    }
    if (address) {
        updates.push('address = ?');
        values.push(address);
    }

    // Добавляем userId в конце массива значений
    values.push(userId);

    // Если не было обновлений, возвращаем ошибку
    if (updates.length === 0) {
        return res.status(400).send('Нет данных для обновления');
    }

    // Собираем SQL-запрос
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    try {
        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Ошибка обновления профиля');
            }
            console.log('Профиль обновлен');
            res.json({ success: true, message: 'Профиль обновлен' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка обновления профиля');
    }
});

// Категории книг 

app.post('/postBooksByCategory', async (req, res) => {
    const { category } = req.body;
    try {
        connection.query('SELECT * FROM books WHERE genre = ? ORDER BY name ASC;', [category], (err, results) => {
            if (err) {
                console.log(err);
            }   else {
                res.json(results);
            }
        })
    } catch (error) {
        console.error('Ошибка получения книг по категории:', error);
        res.status(500).send('Ошибка получения книг по категории');
    }
});

app.post('/postBooksByViews', async (req, res) => {
    try {
        connection.query('SELECT * FROM books ORDER BY views DESC;', (err, results) => {
            if (err) {
                console.log(err);
            }   else {
                res.json(results);
            }
        })
    }
    catch (error) {
        console.error('Ошибка получения книг по просмотрам:', error);
        res.status(500).send('Ошибка получения книг по просмотрам');
    }
});

app.post('/postBooksBySuperprice', async (req, res) => {
    try {
        connection.query('SELECT * FROM books ORDER BY superprice IS NULL, superprice ASC;', (err, results) => {
            if (err) {
                console.log(err);
            }   else {
                res.json(results);
            }
        })
    }
    catch (error) {
        console.error('Ошибка получения книг по цене:', error);
        res.status(500).send('Ошибка получения книг по цене');
    }
});

// Работа с изображениями, аватарами и файлами

app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    const user = req.session.user || null;
    if (!user) {
        return res.status(401).send('Пожалуйста, войдите в систему');
    }

    if (!req.file) {
        return res.status(400).send('Ошибка загрузки файла');
    }
    const filePath = req.file.path;
    console.log('Файл загружен:', filePath);
    const userId = user.id;

    try {
        connection.query('UPDATE users SET avatar_path = ? WHERE id = ?;', [filePath, userId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Ошибка обновления аватара');
            }
            console.log('Аватар обновлен');
            
            res.json({ success: true, message: 'Аватар обновлен', filePath });
        });
    }
    catch (error) {
        console.error('Ошибка обновления аватара:', error);
        res.status(500).send('Ошибка обновления аватара');
    } 
});

// Разлогинивание

app.post('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Ошибка сервера');
        }   else {
            res.redirect('/');
        }}); 
})





app.listen(3000, (err) => {
    if (err) {
    console.log(err);
    }   else {
        console.log('SERVER START ---------> http://localhost:3000');
    }
})