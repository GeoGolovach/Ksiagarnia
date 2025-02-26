import { booksCard } from './booksCard.js';

let currentEvent = 0;
const events = document.querySelectorAll('.event-item');
const categories = document.querySelectorAll('.category-list li.visible');

function showNextEvent() {
    events[currentEvent].classList.remove('active');
    currentEvent = (currentEvent + 1) % events.length;
    events[currentEvent].classList.add('active');

    // Показать категории с эффектом появления
    categories.forEach((category, index) => {
        category.style.opacity = 0; // Скрыть все категории
        setTimeout(() => {
            category.style.opacity = 1; // Показать элемент
        }, index * 500); // Задержка для эффекта
    });
}

// Показать первое событие
events[currentEvent].classList.add('active');
showNextEvent(); // Запустить смену событий
setInterval(showNextEvent, 5000); // Изменение события каждые 5 секунд


const wishlistIcons = document.getElementsByClassName('wishlist-icon');

// Привязываем обработчик событий к каждому элементу
Array.from(wishlistIcons).forEach(icon => {
    icon.addEventListener('click', function(event) {
        const bookId = event.target.dataset.bookId; // Получаем bookId
        const element = event.target; // Сохраняем элемент
        console.log(bookId, element);
        addToWishlist(bookId, element); // Вызываем функцию для добавления в список желаемого
    });
});

// Функция добавления в список желаемого
function addToWishlist(bookId, element) {
    // Переключаем класс 'filled' для изменения состояния сердечка
    element.classList.toggle('filled');

    fetch('/wishlist/add-to-wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId: bookId }) // Передаем bookId в теле запроса
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.statusText);
        }
        alert('Книга добавлена в список желаемого!');
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Эта книга уже есть в вашем списке желаемого!');
    });
}


document.getElementById('category-filter').addEventListener('click', function(event) {
    // Проверяем, что клик был на элементе <li>
    if (event.target.tagName === 'LI') {
        const category = event.target.textContent; // Получаем текст элемента <li>
        filterBooks(category);
    }
});

// Функция фильтрации книг
function filterBooks(category) {
    fetch(`/postBooksByCategory?category=${encodeURIComponent(category)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category: category }) // Передаем категорию в теле запроса
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.statusText);
        }
        return response.json();
    })
    .then(books => {
        const booksContainer = document.querySelector('.col-md-9 .row');
        booksContainer.innerHTML = ''; // Очищаем контейнер с книгами

        books.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4');
            card.innerHTML = booksCard(book); // Убедитесь, что функция booksCard определена
            booksContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при фильтрации книг!');
    });
}


document.getElementById('search').addEventListener('input', function onSearchInput() {
    const search = document.getElementById('search').value;
    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ search: search }) // Передаем поисковый запрос в теле запроса
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.statusText);
        }
        return response.json();
    })
    .then(books => {
        const booksContainer = document.querySelector('.col-md-9 .row');
        booksContainer.innerHTML = ''; // Очищаем контейнер с книгами

        books.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4');
            card.innerHTML = booksCard(book);
            booksContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при поиске книг!');
    })
});


document.getElementById('views-filter').addEventListener('click', function filterViews() {
    fetch('/postBooksByViews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.statusText);
        }
        return response.json();
    })
    .then(books => {
        const booksContainer = document.querySelector('.col-md-9 .row');
        booksContainer.innerHTML = ''; // Очищаем контейнер с книгами

        books.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4');
            card.innerHTML = booksCard(book);
            booksContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при фильтрации книг!');
    })
});

document.getElementById('superprice-filter').addEventListener('click', function filterSuperprice() {
    fetch('/postBooksBySuperprice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.statusText);
        }
        return response.json();
    })
    .then(books => {
        const booksContainer = document.querySelector('.col-md-9 .row');
        booksContainer.innerHTML = ''; // Очищаем контейнер с книгами

        books.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4');
            card.innerHTML = booksCard(book);
            booksContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при фильтрации книг!');
    })
});


