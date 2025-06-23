import { booksCard } from "./booksCard.js";

document.addEventListener('DOMContentLoaded', () => {
  // 1) Каталогные страницы (главная / фильтры / вишлист)
  if (document.getElementById('books-container')) {
    import('./glownastrona.js').then(m => {
      // там твой init-код сразу выполнится
      console.log('catalog loaded');
    });
  }

  // 2) Страница профиля (секции, аватар, изменение профиля)
  if (document.getElementById('avatar-form')) {
    import('./profile.js').then(m => {
      console.log('profile loaded');
    });
  }

  // 3) Админская страница
  if (document.getElementById('admin-panel')) {
    import('./admin.js').then(m => {
      console.log('admin loaded');
    });
  }

  // …другие страницы по id их корневых контейнеров…
});