import { booksCard } from './booksCard.js';

let userWishlist = new Set();
// --- Глобальное состояние для пагинации и фильтров ---
let state = {
    currentPage: 1,
    totalPages: 1,
    currentFilter: {
        type: 'initial', // 'initial', 'category', 'generic'
        params: {}
    }
};

export function initCatalog() {
    const booksContainer = document.getElementById('books-container');
    if (!booksContainer) return;

    // --- Инициализация состояния из data-атрибутов ---
    state.currentPage = parseInt(booksContainer.dataset.currentPage, 10) || 1;
    state.totalPages = parseInt(booksContainer.dataset.totalPages, 10) || 1;
    
    // --- Первоначальный рендер пагинации ---
    renderPagination();

    // Карусель (твой код без изменений)
    let currentEvent = 0;
    const events = document.querySelectorAll('.event-item');
    function showNextEvent() {
        if (events.length === 0) return;
        events[currentEvent].classList.remove('active');
        currentEvent = (currentEvent + 1) % events.length;
        events[currentEvent].classList.add('active');
    }
    if (events.length) {
        events[0].classList.add('active');
        setInterval(showNextEvent, 5000);
    }

    // Wishlist (твой код без изменений)
    const initialWishlistData = booksContainer.dataset.wishlist;
    if (initialWishlistData) {
        try {
            userWishlist = new Set(JSON.parse(initialWishlistData));
        } catch (e) {
            console.error('Failed to parse initial wishlist', e);
        }
    }
    booksContainer.addEventListener('click', async (event) => {
        const wishListIcon = event.target.closest('.wishlist-icon');
        if (!wishListIcon) return;
        const bookId = parseInt(wishListIcon.dataset.bookId, 10);
        if (!bookId) return;
        try {
            const res = await fetch('/users/add-to-wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId: bookId })
            });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) window.location.href = '/auth/login';
                throw new Error('Server error');
            }
            const data = await res.json();
            if (data.success) {
                if (data.status === 'added') {
                    wishListIcon.classList.add('active');
                    userWishlist.add(bookId);
                } else {
                    wishListIcon.classList.remove('active');
                    userWishlist.delete(bookId);
                }
            }
        } catch (error) {
            console.error('Wishlist error:', error);
        }
    });

    renderCategories();
    bindFilterListeners();
    bindSearch(); // Поиск не трогаем
    bindPaginationListener(); // Слушатель для кнопок пагинации
}

// --- ОСНОВНАЯ ФУНКЦИЯ ЗАПРОСА ДАННЫХ ---
async function fetchAndRenderBooks(page = 1) {
    let url = '';
    let body = { page };

    // Определяем URL и тело запроса на основе текущего фильтра
    if (state.currentFilter.type === 'category') {
        url = '/books/filter-category';
        body.category = state.currentFilter.params.category;
    } else if (state.currentFilter.type === 'generic') {
        url = '/books/filter';
        body.sortBy = state.currentFilter.params.sortBy;
        body.sortOrder = state.currentFilter.params.sortOrder;
    } else {
        // Для 'initial' нам не нужно делать fetch, т.к. данные уже есть при загрузке.
        // Но если мы захотим перейти на другую страницу без фильтра, это можно будет дописать.
        // Пока просто выходим.
        window.location.href = `/?page=${page}`; // Возвращаемся к серверной пагинации для начальной загрузки
        return;
    }
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error('Server response was not ok.');

        const data = await res.json(); // Ожидаем { books, currentPage, totalPages }

        // Обновляем состояние
        state.currentPage = data.currentPage;
        state.totalPages = data.totalPages;

        renderBooks(data.books);
        renderPagination();

    } catch (err) {
        console.error('Ошибка при загрузке книг:', err);
        document.getElementById('books-container').innerHTML = `<p class="text-danger text-center">${err.message}</p>`;
    }
}


function bindFilterListeners() {
    // Делегирование событий для всех кнопок-фильтров
    document.querySelector('.container').addEventListener('click', async (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        e.preventDefault();
        
        const filterBy = btn.dataset.filterBy;

        if (filterBy === 'category') {
             state.currentFilter = {
                type: 'category',
                params: { category: btn.dataset.filterValue }
            };
        } else {
             state.currentFilter = {
                type: 'generic',
                params: { sortBy: btn.dataset.sortBy, sortOrder: btn.dataset.sortOrder }
            };
        }
        
        highlightActive(btn, document.querySelectorAll('.filter-btn'));
        // При смене фильтра всегда запрашиваем первую страницу
        fetchAndRenderBooks(1);
    });
}


function bindPaginationListener() {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;

    paginationContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.page-btn');
        if (!btn || btn.disabled) return;

        const page = parseInt(btn.dataset.page, 10);
        if (page !== state.currentPage) {
            fetchAndRenderBooks(page);
        }
    });
}


// --- Функции рендеринга ---

function renderBooks(books) {
    const booksContainer = document.getElementById('books-container');
    if (!booksContainer) return;
    if (!books || books.length === 0) {
        booksContainer.innerHTML = '<p class="text-center col-12">По вашему запросу ничего не найдено.</p>';
        return;
    }
    booksContainer.innerHTML = books
        .map(b => `<div class="col-md-4 mb-4">${booksCard(b, userWishlist)}</div>`)
        .join('');
}

function renderPagination() {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    if (state.totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let buttons = '';
    
    // Кнопка "Назад"
    buttons += `
        <button type="button" class="glow-on-hover page-btn" 
                data-page="${state.currentPage - 1}" 
                ${state.currentPage === 1 ? 'disabled' : ''}>
            «
        </button>`;

    // Кнопки страниц
    for (let i = 1; i <= state.totalPages; i++) {
        buttons += `
            <button type="button" 
                    class="glow-on-hover page-btn ${i === state.currentPage ? 'active' : ''}"
                    data-page="${i}">
                ${i}
            </button>`;
    }

    // Кнопка "Вперед"
    buttons += `
        <button type="button" class="glow-on-hover page-btn" 
                data-page="${state.currentPage + 1}" 
                ${state.currentPage === state.totalPages ? 'disabled' : ''}>
            »
        </button>`;

    container.innerHTML = `
        <div class="btn-toolbar" role="toolbar">
            <div class="btn-group me-2" role="group">
                ${buttons}
            </div>
        </div>`;
}

function renderCategories() {
    const ul = document.getElementById('category-filter');
    if (!ul) return;
    const categories = [
        'Fantazy', 'Poezja', 'Opowoedz', 'Audiobooki', 'Biografie', 'Biznes, ekonomia, marketing', 'Dla dzieci', 'Dla młodzieży', 'Fantastyka, horror', 'Historia', 'Informatyka', 'Komiks', 'Kryminał, sensacja, thriller', 'Książka regionalna', 'Kuchnia i diety', 'Lektury, pomoce szkolne', 'Literatura faktu, reportaż', 'Literatura obyczajowa', 'Literatura piękna obca', 'Literatura piękna polska', 'Nauka języków', 'Nauki społeczne i humanistyczne', 'Nauki ścisłe, medycyna', 'Podręczniki akademickie', 'Podręczniki szkolne, edukacja', 'Poezja, aforyzm, dramat', 'Poradniki', 'Prawo', 'Projekty charytatywne', 'Religie i wyznania', 'Rozwój osobisty', 'Sport i wypoczynek', 'Sztuka', 'Turystyka i podróże', 'Zdrowie, rodzina, związki', 'Young Adult'
    ];
    ul.innerHTML = categories.map(categoryName => `
        <li class="berkshire-swash-first filter-btn"
            data-url="/books/filter-category"
            data-filter-by="category"
            data-filter-value="${categoryName}">
            ${categoryName}
        </li>
    `).join('');
}

// --- Поиск не трогаем, твой код без изменений ---
function bindSearch() {
    const input = document.getElementById('search');
    if (!input) return;
    let timeout;
    input.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            const q = input.value.trim();
            // При поиске сбрасываем пагинацию и фильтры
            state.totalPages = 1;
            renderPagination(); 
            try {
                const res = await fetch('/books/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ search: q })
                });
                if (!res.ok) throw new Error(res.statusText);
                const books = await res.json();
                renderBooks(books);
            } catch (err) {
                console.error('Search error:', err);
            }
        }, 300);
    });
}

function highlightActive(activeBtn, allBtns) {
    allBtns.forEach(b => b.classList.remove('active'));
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Самоподхват
if (document.readyState !== 'loading') {
    initCatalog();
} else {
    document.addEventListener('DOMContentLoaded', initCatalog);
}