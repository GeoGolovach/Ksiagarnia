document.getElementById('addBookForm').addEventListener('submit', function(event) {
    console.log("Форма отправлена!");
    event.preventDefault();

const formData = new FormData(this);
const book = {
    name: formData.get('name'),
    author: formData.get('author'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl'),
    link: formData.get('link')
};

// Отправка данных на сервер
console.log(book);
fetch('/add-book', {
method: 'POST',
headers: {
    'Content-Type': 'application/json',
},
body: JSON.stringify(book)
})
.then(response => response.json())
.then(data => {
console.log('Успех:', data);
// Обновите интерфейс или выполните другие действия
})
.catch((error) => {
console.error('Ошибка:', error);
});
});

document.getElementById('deleteBookForm').addEventListener('submit', function(event) {
event.preventDefault();

const formData = new FormData(this);
const bookToDelete = {
    name: formData.get('name'),
    author: formData.get('author')
};

// Отправка данных на сервер для удаления
fetch('/delete-book', {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookToDelete)
})
.then(response => response.json())
.then(data => {
    console.log('Успех:', data);
    // Обновите интерфейс или выполните другие действия, например, очистить поля
    this.reset();
})
.catch((error) => {
    console.error('Ошибка:', error);
});
});

$(document).ready(function () {
    $('#booksSection').hide(); // Скрыть секцию книг по умолчанию
    $('#usersSection').hide(); // Скрыть секцию пользователей по умолчанию

    $('#showBooks').click(function () {
        $('#usersSection').hide(); // Скрыть пользователей
        $('#booksSection').show(); // Показать книги

        $.get('/admin/books', function (books) {
            $('#booksList').empty(); // Очистить текущий список
            books.forEach(book => {
                $('#booksList').append(`
                    <tr>
                        <td>${book.id}</td>
                        <td>${book.name}</td>
                        <td>${book.author}</td>
                        <td><button class="btn btn-danger deleteBook" data-name="${book.name}" data-author="${book.author}">Удалить</button></td>
                    </tr>
                `);
            });
        });
    });

    $('#showUsers').click(function () {
        $('#booksSection').hide(); // Скрыть книги
        $('#usersSection').show(); // Показать пользователей

        $.get('/admin/users', function (users) {
            $('#usersList').empty(); // Очистить текущий список
            users.forEach(user => {
                $('#usersList').append(`
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name} ${user.lastName}</td>
                        <td>${user.email}</td>
                        <td>${user.isAdmin ? 'Администратор' : 'Пользователь'}</td>
                    </tr>
                `);
            });
        });
    });
});