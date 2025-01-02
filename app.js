const express = require('express');
const mysql = require('mysql2');
const bcrypt = require("bcrypt");
const session = require('express-session');
const multer = require('multer');
const app = express();
const { Book, books } = require('./public/models/book');


const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'book_shop'
});

connection.connect(err => {
    if (err) {
        console.log(err);

    }   else {
        console.log('DATABASE -------> START')
    }
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static('public'))

app.use(session({
    secret: '8hD$3pQ!tV@9xW&7zJ*2kR#5fL%1mN^4y',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 день в миллисекундах
    }
}));

app.get('/', async (req, res) => {
    try {
        const books = await getBooks();
        const user = req.session.user || null; // Получаем информацию о пользователе из сессии
        res.render('glownastrona', { books, user });
    }catch (err) {
        console.error(err);
        res.status(500).send('Server error');
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
                res.render('book1', { book, user });
            } else {
                res.status(404).send('Книга не найдена');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Ошибка сервера');
        }
    }
});

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
                        isAdmin: isAdmin
                    };

                    if (isAdmin) {
                        return res.redirect('/admin');
                    }   else {
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

    async function getBooks() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM books', (err, results) => {
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

app.get('/profile', (req, res) => {
    const user = req.session.user || null;
    if (!user) {
        return res.redirect('/zalogowanie');
    }   else {
    res.render('profile', { user });
    }
})

app.get('/orders', async(req, res) => {
    const user = req.session.user || null;
    if (!user) {
        return res.redirect('/zalogowanie');
    }   else {
        try {
            const orders = await db.getOrdersByUserId(userId); // Получите заказы из базы данных
            res.json(orders);
        } catch (error) {
            res.status(500).send('Ошибка получения заказов');
        }
    }
})

app.post('/add-order', async (req, res) => {
    const { bookId, userId } = req.body;
    try {
        await db.addOrder(bookId, userId); // Добавьте заказ в базу данных
        res.json({ message: 'Заказ добавлен' });
    } catch (error) {
        res.status(500).send('Ошибка добавления заказа');
    }
});

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



app.listen(3000, (err) => {
    if (err) {
    console.log(err);
    }   else {
        console.log('SERVER START ---------> http://localhost:3000');
    }
})