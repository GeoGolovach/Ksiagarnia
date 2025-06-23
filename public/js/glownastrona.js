

import { booksCard } from './booksCard.js';

export function initCatalog() {
  // 1) Проверяем — это ли наша страница?
  const booksContainer = document.getElementById('books-container');
  if (!booksContainer) return;

  // 2) Карусель событий
  let currentEvent = 0;
  const events       = document.querySelectorAll('.event-item');
  const catElements  = document.querySelectorAll('.category-list li.visible');

  function showNextEvent() {
    events[currentEvent].classList.remove('active');
    currentEvent = (currentEvent + 1) % events.length;
    events[currentEvent].classList.add('active');

    catElements.forEach((el, i) => {
      el.style.opacity = 0;
      setTimeout(() => (el.style.opacity = 1), i * 500);
    });
  }

  if (events.length) {
    events[currentEvent].classList.add('active');
    showNextEvent();
    setInterval(showNextEvent, 5000);
  }

  // 3) Wishlist
  function bindWishlist() {
    const icons = document.getElementsByClassName('wishlist-icon');
    Array.from(icons).forEach(icon => {
      const bookId = icon.dataset.bookId;
      icon.addEventListener('click', async () => {
        icon.classList.toggle('filled');
        try {
          const res = await fetch('/users/profile/add-to-wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId })
          });
          if (!res.ok) throw new Error(res.statusText);
          alert('Книга добавлена в список желаемого!');
        } catch {
          alert('Эта книга уже в списке желаемого или ошибка сети');
        }
      });
    });
  }
  bindWishlist();

  const categories = [
  'Fantazy',
  'Poezja',
  'Opowoedz',
  'Audiobooki',
  'Biografie',
  'Biznes, ekonomia, marketing',
  'Dla dzieci',
  'Dla młodzieży',
  'Fantastyka, horror',
  'Historia',
  'Informatyka',
  'Komiks',
  'Kryminał, sensacja, thriller',
  'Książka regionalna',
  'Kuchnia i diety',
  'Lektury, pomoce szkolne',
  'Literatura faktu, reportaż',
  'Literatura obyczajowa',
  'Literatura piękna obca',
  'Literatura piękna polska',
  'Nauka języków',
  'Nauki społeczne i humanistyczne',
  'Nauki ścisłe, medycyna',
  'Podręczniki akademickie',
  'Podręczniki szkolne, edukacja',
  'Poezja, aforyzm, dramat',
  'Poradniki',
  'Prawo',
  'Projekty charytatywne',
  'Religie i wyznania',
  'Rozwój osobisty',
  'Sport i wypoczynek',
  'Sztuka',
  'Turystyka i podróże',
  'Zdrowie, rodzina, związki',
  'Young Adult'
];

 function renderCategories() {
  const ul = document.getElementById('category-filter');
  if (!ul) return;

  ul.innerHTML = categories.map(c => {
    // делаем «безопасный» id из текста (не обязателен, но полезен)
    const safeId = c.toLowerCase()
      .replace(/[\s,]+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    return `
      <li
        id="filter-${safeId}"
        class="berkshire-swash-first filter-btn2"
        data-url="/books/postBooksByCategory"
        
      >${c}</li>
    `;
  }).join('');
}
renderCategories();


  // 4) Фильтрация по категории
  function bindCategoryFilter() {
  const ul = document.getElementById('category-filter');
  if (!ul) return;

  ul.addEventListener('click', async e => {
    const btn = e.target.closest('.filter-btn2');
    if (!btn) return;

    e.stopImmediatePropagation();

    // читаем URL и именно ту категорию, которую видит пользователь
    const url      = btn.dataset.url;          // "/books/postBooksByCategory"
    const category = btn.textContent.trim();  
    console.log(btn, btn.tagName);
   // "Fantazy", "Poezja" и т.д.

    // визуальный «щелчок»
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 150);

    try {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
    });

    // Если статус не 200, пробрасываем ошибку
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка сервера');
    }

    const books = await res.json();
    
    if (!books || books.length === 0) {
        throw new Error('Книги не найдены');
    }

    renderBooks(books);
} catch (err) {
    console.error('Ошибка фильтрации:', err);
    alert('Ошибка: ' + err.message); // Показываем конкретную ошибку
}
  });
}
  bindCategoryFilter();

  // 5) Поиск
  function bindSearch() {
    const input = document.getElementById('search');
    if (!input) return;
    let timeout;
    input.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const q = input.value.trim();
        try {
          const res = await fetch('/books/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ search: q })
          });
          if (!res.ok) throw new Error(res.statusText);
          const books = await res.json();
          renderBooks(books);
        } catch {
          console.error('Search error');
        }
      }, 300);
    });
  }
  bindSearch();

     


  // 6) Общая логика «POST по кнопкам» (TOP 100, Super ceny и т.д.)
  function bindGenericFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const url = btn.dataset.url;
        try {
          const res   = await fetch(url, { method: 'POST' });
          const books = await res.json();
          renderBooks(books);
          highlightActive(btn, btns);
        } catch {
          alert('Ошибка загрузки фильтра');
        }
      });
    });
  }
  bindGenericFilters();

  // 7) Вспомогательные функции
  function renderBooks(books) {
    booksContainer.innerHTML = books
      .map(b => `<div class="col-md-4 mb-4">${booksCard(b)}</div>`)
      .join('');
    // можно здесь же: bindWishlist();
  }

  function highlightActive(activeBtn, allBtns) {
    allBtns.forEach(b => b.classList.toggle('active', b === activeBtn));
  }


}

// Самоподхват при загрузке, если этот модуль «один»
if (document.readyState !== 'loading') {
  initCatalog();
} else {
  document.addEventListener('DOMContentLoaded', initCatalog);
}










