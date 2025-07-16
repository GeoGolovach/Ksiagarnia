import { response } from 'express';

const { jest, describe, it, expect, beforeEach, beforeAll } = await import('@jest/globals');
const path = (await import('path')).default;
const fs = (await import('fs')).default;
const { fileURLToPath } = await import('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await jest.unstable_mockModule('../../services/userService.js', () => ({
    default: {
        updateUser: jest.fn(),
        updateAvatar: jest.fn(),
        getWishlist: jest.fn(),
        getOrders: jest.fn(),
        addBookToWishlist: jest.fn(),
        deleteBookFromWishlist: jest.fn(),
        deleteBookFromOrders: jest.fn()
    }
}));

await jest.unstable_mockModule('../../services/authService.js', () => ({
    default: { authenticateUser: jest.fn() }
}));

await jest.unstable_mockModule('fs/promises', () => ({
    default: { unlink: jest.fn() }
}));

await jest.unstable_mockModule('../../config/multer.js', () => ({
    upload: {
        single: jest.fn().mockImplementation((fieldName) => 
            (req, res, next) => {
                req.file = {
                    filename: 'mock-avatar-123.jpg',
                    path: 'uploads/mock-avatar-123.jpg'
                };
                next();
            }
        ),
    }
}));

const request = (await  import('supertest')).default;
const app = (await import('../../app.js')).default;
const authService = (await import('../../services/authService.js')).default;
const userService = (await import('../../services/userService.js')).default;

describe('User Profile Routes (Authenticated)', () => {

    let agent; // Создаем переменную для нашего "агента" (браузера)
    const fakeUserId = 1; // ID пользователя, под которым мы "войдем"

    // Этот хук выполнится один раз перед всеми тестами в этой группе
    beforeAll(async () => {
        // 1. Создаем нового агента для чистого теста
        agent = request.agent(app);

        // 2. "Программируем" сервис аутентификации на успешный вход
        const fakeUser = { id: fakeUserId, name: 'Test User', isAdmin: false };
        authService.authenticateUser.mockResolvedValue(fakeUser);

        // 3. Выполняем "логин" через агента, чтобы он получил и сохранил сессионную куку
        await agent
            .post('/auth/login')
            .send({ email: 'test@test.com', password: 'password' });

        
    });

    describe('POST users/update-profile', () => {

        beforeEach(() => {
            userService.updateUser.mockClear();
        });

        it('should update profile and redirect on success', async () => {
            const fakeUserFromService = { 
                id: 1,
                name: 'Test', 
                lastname: 'Test', 
                email: 'test@test.com', 
                password: 'hashedpasswoed123',
                phone: '123456789', 
                address: 'testHome' 
            };
            const fakeData = {
                name: 'Test',
                email: 'test@test.com',
                phone: '123456789',
                address: 'testHome'
            };

            userService.updateUser.mockResolvedValue(fakeUserFromService);

            const response = await agent
                .post('/users/update-profile')
                .send(fakeData);

            expect(userService.updateUser).toHaveBeenCalledWith(fakeUserId, fakeData);
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe('/users/profile');
        });

        it('should return 500 status if service throws an error', async () => {
            const fakeData = { name: 'Trying to update' }

            const error = new Error('you havent new data');
            userService.updateUser.mockRejectedValue(error);

            const response = await agent
                .post('/users/update-profile')
                .send(fakeData);

            expect(userService.updateUser).toHaveBeenCalledWith( fakeUserId, fakeData );
            expect(response.statusCode).toBe(500);

        });
    });

    describe('POST users/upload-avatar', () => {

        beforeEach(() => {
            userService.updateAvatar.mockClear();
        });

        it('should update avatar, update session, and redirect on successful upload', async () => {
            const fakeFilePath = 'uploads/fake-avatar.jpg';
            const imagePath = path.resolve(__dirname, '../test-image.txt'); 

            userService.updateAvatar.mockResolvedValue({ avatar_path: fakeFilePath });

            const response = await agent
                .post('/users/upload-avatar')
                // .attach(имя_поля_в_форме, путь_к_файлу)
                .attach('avatar', imagePath);

            expect(userService.updateAvatar).toHaveBeenCalledWith(fakeUserId, expect.stringContaining('uploads/'));
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toContain('/users/profile');
        });

        it.skip('should redirect with an error if no file is uploaded', async () => {
            const response = await agent
                .post('/users/upload-avatar')
                .send(); // Отправляем пустой запрос

            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe('/users/profile?error=upload_failed');
            expect(userService.updateAvatar).not.toHaveBeenCalled();
        });

        it('should return 500 if the service fails', async () => {
            const imagePath = path.resolve(__dirname, '../test-image.txt');
        
            userService.updateAvatar.mockRejectedValue(new Error('Database error'));

            const response = await agent
                .post('/users/upload-avatar')
                .attach('avatar', imagePath);

            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST users/add-to-wishlist', () => {

        beforeEach(() => {
            userService.addBookToWishlist.mockClear();
        });

        it('should return status "added" when adding a new book', async () => {
            const requestBody = { bookId: 101 };

            userService.addBookToWishlist.mockResolvedValue({ status: 'added' });

            const response = await agent
                .post('/users/add-to-wishlist')
                .send(requestBody);

            expect(userService.addBookToWishlist).toHaveBeenCalledWith(fakeUserId, requestBody.bookId);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ success: true, status: 'added' });
        });

        it('should return status "delete" when removing a book', async () => {
            const requestBody = { bookId: 102 };

            userService.addBookToWishlist.mockResolvedValue({ status: 'delete' });

            const response = await agent
                .post('/users/add-to-wishlist')
                .send(requestBody);

            expect(userService.addBookToWishlist).toHaveBeenCalledWith(fakeUserId, requestBody.bookId);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ success: true, status: 'delete' });
        });

        it('should return 400 if bookId is not provided', async () => {
            
            const response = await agent
                .post('/users/add-to-wishlist')
                .send({})

            expect(userService.addBookToWishlist).not.toHaveBeenCalled();
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('bookId is required');
        });

        it('', async () => {
            const requestBody = { bookId: 103 };

            const error = new Error('Service error')
            userService.addBookToWishlist.mockRejectedValue(error);

            const response = await agent
                .post('/users/add-to-wishlist')
                .send(requestBody);

            expect(userService.addBookToWishlist).toHaveBeenCalledWith(fakeUserId, requestBody.bookId);
            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST users/profile/orders', () => {

        beforeEach(() => {
            userService.getOrders.mockClear();
        }); 

        it('should return an array of book objects for a user with orders', async () => {
            const booksFromServices = [
                { id: 1, name: 'Test', author: 'Test' },
                { id: 2, name: 'Test2', author: 'Test2' }
            ];

            userService.getOrders.mockResolvedValue(booksFromServices);

            const response = await agent 
                .post('/users/profile/orders');

            expect(userService.getOrders).toHaveBeenCalledWith(fakeUserId);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(booksFromServices);
        });

        it('should return an empty array for a user with no orders', async () => {
            userService.getOrders.mockResolvedValue([]);

            const response = await agent
                .post('/users/profile/orders');

            expect(userService.getOrders).toHaveBeenCalledWith(fakeUserId);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should return 500 if the service throws an error', async () => {
            const error = new Error('Books from Service error');
            userService.getOrders.mockRejectedValue(error);

            const response = await agent
                .post('/users/profile/orders');

            expect(userService.getOrders).toHaveBeenCalledWith(fakeUserId);
            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST users/profile/wishlist', () => {

        beforeEach(() => {
            userService.getWishlist.mockClear();
        });

        it('should return an array of book objects for a user with wishlist', async () => {
            const booksFromServices = [
                { id: 1, name: 'Test', author: 'Test' },
                { id: 2, name: 'Test2', author: 'Test2' }
            ];
            userService.getWishlist.mockResolvedValue(booksFromServices);

            const response = await agent
                .post('/users/profile/wishlist');

            expect(userService.getWishlist).toHaveBeenCalledWith(fakeUserId);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(booksFromServices);
        });

        it('should return an empty array for a user with no wishlist', async () => {
            userService.getWishlist.mockResolvedValue([]);

            const response = await agent
                .post('/users/profile/wishlist')
            
            expect(userService.getWishlist).toHaveBeenCalledWith(fakeUserId);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should return 500 if the service throws an error', async () => {
            const error = new Error('error Wishlist from Services');
            userService.getWishlist.mockRejectedValue(error);

            const response = await agent
                .post('/users/profile/wishlist');

            expect(userService.getWishlist).toHaveBeenCalledWith(fakeUserId);
            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST users/profile/wishlist/remove-from-wishlist', () => {

        beforeEach(() => {
            userService.deleteBookFromWishlist.mockClear();
        });

        it('should return success & status from wishlist', async () => {
            const reqBody = { bookId: 1 };
            const result = { success: true, status: 'removed' }
            userService.deleteBookFromWishlist.mockResolvedValue(result);

            const response = await agent
                .post('/users/profile/wishlist/remove-from-wishlist')
                .send(reqBody);

            expect(userService.deleteBookFromWishlist).toHaveBeenCalledWith(fakeUserId, reqBody.bookId);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(result);
        });

        it('should return status: not_found from wishlist', async () => {
            const reqBody = { bookId: 999 };
            const result = { success: true, status: 'not_found' };

            userService.deleteBookFromWishlist.mockResolvedValue(result);

            const response = await agent
                .post('/users/profile/wishlist/remove-from-wishlist')
                .send(reqBody);

            expect(userService.deleteBookFromWishlist).toHaveBeenCalledWith(fakeUserId, reqBody.bookId);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(result);
        });

        it('should return 500 if the service throws an error', async () => {
            const reqBody = { bookId: 1 };
            const error = new Error('error get wishlist from service');
            userService.deleteBookFromWishlist.mockRejectedValue(error);

            const response = await agent
                .post('/users/profile/wishlist/remove-from-wishlist')
                .send(reqBody);

            expect(userService.deleteBookFromWishlist).toHaveBeenCalledWith(fakeUserId, reqBody.bookId);
            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST users/profile/orders/remove-from-orders', () => {

        beforeEach(() => {
            userService.deleteBookFromOrders.mockClear();
        });

        it('should return success & status from orders', async () => {
            const reqBody = { bookId: 1 };
            const result = { success: true, status: 'removed' }
            userService.deleteBookFromOrders.mockResolvedValue(result);

            const response = await agent
                .post('/users/profile/orders/remove-from-orders')
                .send(reqBody);

            expect(userService.deleteBookFromOrders).toHaveBeenCalledWith(fakeUserId, reqBody.bookId);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(result);
        });

        it('should return status: not_found from orders', async () => {
            const reqBody = { bookId: 999 };
            const result = { success: true, status: 'not_found' };

            userService.deleteBookFromOrders.mockResolvedValue(result);

            const response = await agent
                .post('/users/profile/orders/remove-from-orders')
                .send(reqBody);

            expect(userService.deleteBookFromOrders).toHaveBeenCalledWith(fakeUserId, reqBody.bookId);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(result);
        });

        it('should return 500 if the service throws an error', async () => {
            const reqBody = { bookId: 1 };
            const error = new Error('error get orders from service');
            userService.deleteBookFromOrders.mockRejectedValue(error);

            const response = await agent
                .post('/users/profile/orders/remove-from-orders')
                .send(reqBody);

            expect(userService.deleteBookFromOrders).toHaveBeenCalledWith(fakeUserId, reqBody.bookId);
            expect(response.statusCode).toBe(500);
        });
    });
});

