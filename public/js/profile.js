// public/js/profile.js
import { ordersCard } from './ordersCard.js';

export function initProfile() {
  const initial = new URLSearchParams(location.search).get('section') || 'profile';
  showSection(initial);

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
    try {
      const res = await fetch('/users/profile/orders', { method: 'POST' });
      if (!res.ok) throw new Error(res.statusText);
      const { orders, books } = await res.json();
      if (orders.length) {
        orders.forEach(o => {
          const book = books.find(b => b.id === o.book_id);
          container.innerHTML += ordersCard(book, 'orders');
        });
        document.querySelectorAll('.delete-btn-orders').forEach(btn => {
          btn.addEventListener('click', async () => {
            const bookId = btn.dataset.id;
            const r2 = await fetch(
              '/users/profile/orders/remove-from-orders',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId })
              }
            );
            const { success } = await r2.json();
            if (success) showOrders();
            else alert('Не удалось удалить заказ');
          });
        });
      } else {
        container.innerHTML = '<p>Nie masz zamówień</p>';
      }
      sec.style.display = 'block';
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки заказов');
    }
  }

  // Подгрузить и показать «Wishlist»
  async function showWishlist() {
    hideAll();
    const sec = sections.wishlist;
    const container = document.getElementById('wishlist-content');
    container.innerHTML = '';
    try {
      const res = await fetch('/users/profile/wishlist', { method: 'POST' });
      if (!res.ok) throw new Error(res.statusText);
      const { wishlist, books } = await res.json();
      if (wishlist.length) {
        wishlist.forEach(item => {
          const book = books.find(b => b.id === item.book_id);
          container.innerHTML += ordersCard(book, 'wishlist');
        });
        document.querySelectorAll('.delete-btn-wishlist').forEach(btn => {
          btn.addEventListener('click', async () => {
            const bookId = btn.dataset.id;
            const r2 = await fetch(
              '/users/profile/wishlist/remove-from-wishlist',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId })
              }
            );
            const { success } = await r2.json();
            if (success) showWishlist();
            else alert('Не удалось удалить из избранного');
          });
        });
      } else {
        container.innerHTML = '<p>Nie masz żadnej książki</p>';
      }
      sec.style.display = 'block';
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки избранного');
    }
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
