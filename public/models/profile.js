import { ordersCard } from './ordersCard.js';

document.addEventListener('DOMContentLoaded', function() {
    const sectionToShow = new URLSearchParams(window.location.search).get('section');
    if (sectionToShow === 'orders') {
        showSection('orders');
    } else if (sectionToShow === 'wishlist') {
        showSection('wishlist');
    } else {
        showSection('profile');
    }
});

document.querySelector('.logout-btn').addEventListener('click', function() {
    fetch('/logout', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                window.location.href = '/';
            } else {
                console.log('Ошибка:', response.statusText);
                alert('Ошибка при выходе: ' + response.statusText);
            }
        })
        .catch(err => console.error('Ошибка:', err));
});

document.getElementById('orders').addEventListener('click', function(event) {
    console.log('orders');
    showSection('orders');
});

document.getElementById('wishlist').addEventListener('click', function(event) {
    showSection('wishlist');
});

document.getElementById('settings').addEventListener('click', function(event) {
    showSection('profile');
});

document.getElementById('logout').addEventListener('click', function(event) {
    showSection('logout1');
});

document.getElementById('support').addEventListener('click', function(event) {
    showSection('support');
});

function showSection(sectionId) {
    console.log('sectionId:', sectionId);
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Скрываем все секции
    });

    if (sectionId === 'orders') {
        console.log('sectionId:', sectionId);
        fetch('/orders')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                const ordersSection = document.getElementById('orders-section');
                const ordersContent = document.getElementById('orders-content');
                ordersContent.innerHTML = ''; // Очищаем предыдущие заказы
                if (data.orders.length > 0) {
                    console.log('data.orders:', data.orders);
                    data.orders.forEach(order => {
                        const book = data.books.find(b => b.id === order.book_id);
                        ordersContent.innerHTML += ordersCard(book, sectionId);
                    });

                    const deleteButtonsOrders = document.querySelectorAll('.delete-btn-orders');
deleteButtonsOrders.forEach(button => {
    button.addEventListener('click', function(event) {
        const bookId = event.target.dataset.id; // Получаем ID книги
        fetch('/orders/remove-from-orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookId: bookId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showSection('orders'); // Обновляем секцию
            } else {
                alert('Не удалось удалить книгу из списка желаемого');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось удалить книгу из списка желаемого: ' + error.message);
        });
    });
});

                } else {
                    ordersContent.innerHTML = '<p>У вас нет книг в корзине</p>';
                }
                ordersSection.style.display = 'block'; // Показываем секцию
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Не удалось загрузить заказы: ' + error.message);
            });

    } else if (sectionId === 'wishlist') {
        fetch('/wishlist')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const wishlistSection = document.getElementById('wishlist-section');
                const wishlistContent = document.getElementById('wishlist-content');
                wishlistContent.innerHTML = ''; // Очищаем предыдущий список желаемого

                if (data.wishlist.length > 0) {
                    data.wishlist.forEach(item => {
                        const book = data.books.find(b => b.id === item.book_id);
                        wishlistContent.innerHTML += ordersCard(book, sectionId);
                    });
                    const deleteButtonsWishlist = document.querySelectorAll('.delete-btn-wishlist');
deleteButtonsWishlist.forEach(button => {
    button.addEventListener('click', function(event) {
        const bookId = event.target.dataset.id; // Получаем ID книги
        fetch('/wishlist/remove-from-wishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookId: bookId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showSection('wishlist'); // Обновляем секцию
            } else {
                alert('Не удалось удалить книгу из списка желаемого');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось удалить книгу из списка желаемого: ' + error.message);
        });
    });
});
                } else {
                    wishlistContent.innerHTML = '<p>У вас нет книг в списке желаемого</p>';
                }
                wishlistSection.style.display = 'block'; // Показываем секцию
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Не удалось загрузить список желаемого: ' + error.message);
            });
    } else if (sectionId === 'settings') {
        showSection('profile');

    } else if (sectionId === 'support') {
        const supportSection = document.getElementById('support-section');
        supportSection.style.display = 'block'; // Показываем секцию

        } else if (sectionId === 'logout') {
            const logoutSection = document.getElementById('logout');
            logoutSection.style.display = 'block'; // Показываем секцию
        } else {
            const section = document.getElementById(sectionId);
            section.style.display = 'block'; // Показываем выбранную секцию
        }
    }

document.getElementById('update-btn').addEventListener('click', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    fetch('/update-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, phone, address })
    })
        .then(response => {
            if (!response.ok) {
                console.log('Ошибка:', response.statusText);
                throw new Error('Ошибка сети: ' + response.statusText);
            }
            console.log('response:', response);
            return response.json();
        })
        .then(data => {
            console.log('data:', data);
            if (data.success) {
                window.location.reload();
                alert('Данные успешно обновлены');
            } else {
                console.log('Ошибка:', data.message);
                alert('Не удалось обновить данные');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось обновить данные: ' + error.message);
        });
});

document.getElementById('avatar-btn').addEventListener('click', function(event) {
    event.preventDefault();

    const avatar = document.querySelector('input[type="file"]').files[0];
    const formData = new FormData();
    formData.append('avatar', avatar);

    fetch('/upload-avatar', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                document.getElementById('avatar-img').src = data.filePath;
                alert('Аватар успешно обновлен');
            } else {
                alert('Не удалось обновить аватар');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось обновить аватар: ' + error.message);
        });
});
