const express = require('express');

const app = express();

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(express.static('styles'))

app.get('/', (req, res) => {
    res.render('glownastrona')
})

app.get('/zalogowanie', (req, res) => {
    res.render('zalogowanie')
})

app.post('/data-form', (req, res) => {
    let name = req.body.name
    let password = req.body.password
    if (name == "" && password == "") {
        return res.redirect('/zalogowanie')
    }   else {
        return res.redirect('/')
    }
})



app.listen(3000, () => {
    console.log('Server on : http://localhost:3000')
})