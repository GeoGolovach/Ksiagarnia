const express = require('express');
const mysql = require('mysql2');
const bcrypt = require("bcrypt");
const session = require('express-session');
const app = express();
const { Book, books } = require('./models/book');


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
    cookie: { secure: false } 
}));

app.get('/', (req, res) => {
    res.render('glownastrona', { books, books })
})

app.get('/zalogowanie', (req, res) => {
    res.render('zalogowanie')
})

app.get('/zarejestrowanie', (req, res) => {
    res.render('zarejestrowanie')
})

app.get('/book1', (req, res) => {
    const book1 = books[0]; 
    res.render('book1', { book: book1 }); 
});

app.get('/admin', (req, res) => {
    res.render('admin');
})

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

        let sql = `INSERT INTO users (name, lastname, email, password) VALUES ("${name}", "${lastName}", "${email}", "${hash}");`;
        
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }   else {
                console.log('one person INSERT INTO users');
            }
    
        })
        return res.redirect('/');
    })
    });
    
    app.post('/add-book', (req, res) => {
        const { name, author, description, imageUrl, link } = req.body;
        
        const newBook = new Book(name, author, description, imageUrl, link);
        
        let sql3 = `INSERT INTO books (name, author, description, imageUrl, link) VALUES (?, ?, ?, ?, ?)`;
        connection.query(sql3, [name, author, description, imageUrl, link], (err, result) => {
            if (err) {
                console.log(err);
            }   else {
                console.log('one book INSERT INTO books');
            }
        })
    
        res.status(201).json({ message: 'Книга добавлена', book: newBook });
    });



app.listen(3000, (err) => {
    if (err) {
    console.log(err);
    }   else {
        console.log('SERVER START ---------> http://localhost:3000');
    }
})