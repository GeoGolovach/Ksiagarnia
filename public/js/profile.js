// public/js/profile.js
import { ordersCard } from './ordersCard.js';

export function initProfile() {

  const menuBtns = document.querySelectorAll('.settings-btn');
  if (!menuBtns.length) return;

  // Получаем все секции «контента»
  const sections = {
    orders:   document.getElementById('orders-section'),
    wishlist: document.getElementById('wishlist-section'),
    support:  document.getElementById('support-section'),
    logout:   document.getElementById('logout1'),
    profile:  document.getElementById('profile')
  };

  // Скрыть **все** секции
  function hideAll() {
    Object.values(sections).forEach(sec => {
      if (sec) sec.style.display = 'none';
    });
  }

  // Подгрузить и показать «Заказы»
  async function showOrders() {
    hideAll();
    const sec = sections.orders;
    const container = document.getElementById('orders-content');
    container.innerHTML = '';
    
    container.innerHTML = '<p>Ładowanie zamówień...</p>';
    sec.style.display = 'block'; 

    try {
      const res = await fetch('/users/profile/orders', { method: 'POST' });

      if (!res.ok) {
            // Если сервер вернул ошибку, показываем ее
            const errorData = await res.json();
            throw new Error(errorData.message || 'Błąd serwera');
        }

          const orders = await res.json();

          container.innerHTML = ''; 

      if (orders.length > 0) {
            orders.forEach(book => {
                container.innerHTML += ordersCard(book, 'orders');
            });
      } else {
        container.innerHTML = '<p>Nie masz zamówień</p>';
      }
    } catch (err) {
        console.error('Ошибка загрузки заказов:', err);
        container.innerHTML = `<p style="color: red;">${err.message}</p>`;
    }
  }

  // Подгрузить и показать «Wishlist»
  async function showWishlist() {
    hideAll();
    const sec = sections.wishlist;
    const container = document.getElementById('wishlist-content');
    
    // Для лучшего UX, показываем индикатор загрузки
    container.innerHTML = '<p>Ładowanie listy życzeń...</p>';
    sec.style.display = 'block'; // Показываем секцию сразу

    try {
        // 1. Получаем данные с бэкенда
        const res = await fetch('/users/profile/wishlist', { method: 'POST' });
        if (!res.ok) {
            // Если сервер вернул ошибку, показываем ее
            const errorData = await res.json();
            throw new Error(errorData.message || 'Błąd serwera');
        }
        
        const books = await res.json();
        
        // 2. Очищаем контейнер и рендерим книги
        container.innerHTML = ''; 

        if (books.length > 0) {
            books.forEach(book => {
                // Используем твою универсальную карточку, передавая 'wishlist' как id секции
                container.innerHTML += ordersCard(book, 'wishlist');
            });
        } else {
            container.innerHTML = '<p>Twoja lista życzeń jest pusta.</p>';
        }
    } catch (err) {
        console.error('Ошибка загрузки избранного:', err);
        container.innerHTML = `<p style="color: red;">${err.message}</p>`;
    }
}

const contentContainer = document.querySelector('.content');
    if (contentContainer) {
        contentContainer.addEventListener('click', async (event) => {
            const deleteBtn = event.target.closest('.delete-btn');
            if (!deleteBtn) return; // Клик был не по кнопке удаления

            const { bookId, url, refreshKey } = deleteBtn.dataset;

            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookId })
                });
                const result = await res.json();

                if (result.success) {
                    // Динамически вызываем нужную функцию для обновления
                    const refreshFunction = ACTIONS[refreshKey];
                    if (refreshFunction) {
                        refreshFunction();
                    }
                } else {
                    alert('Операция не удалась');
                }
            } catch (err) {
                console.error('Delete error:', err);
                alert('Произошла ошибка');
            }
        });
    }

  // Просто показать «Support»
  function showSupport() {
    hideAll();
    sections.support.style.display = 'block';
  }

  // Показать «Logout»
  function showLogout() {
    hideAll();
    sections.logout.style.display = 'block';
  }

  // Показать «Profile»
  function showProfile() {
    hideAll();
    // У вас в CSS для #profile прописан display:flex
    sections.profile.style.display = 'flex';
  }

  // Мапим ключ → функция
  const ACTIONS = {
    orders:   showOrders,
    wishlist: showWishlist,
    support:  showSupport,
    logout:   showLogout,
    settings: showProfile,
    about:    showProfile,
    terms:    showProfile,
    privacy:  showProfile,
    security: showProfile,
    notifications: showProfile,
    payment:  showProfile,
    profile:  showProfile
  };

  // Инициализация секции из URL ?section=…
  const fromUrl = new URLSearchParams(location.search).get('section');
  const key = fromUrl && ACTIONS[fromUrl] ? fromUrl : 'profile';
  ACTIONS[key]();

  // Навешиваем клики на меню
  menuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.id;
      const fn = ACTIONS[id] || showProfile;
      fn();
    });
  });
}

// Авто-старт
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfile);
} else {
  initProfile();
}
