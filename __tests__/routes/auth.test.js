const { jest, describe, it, expect, beforeEach } = await import('@jest/globals');

await jest.unstable_mockModule('../../services/authService.js', () => ({
    default: {
        authenticateUser: jest.fn(),
        createUser: jest.fn(),
    }
}));

const request = (await  import('supertest')).default;
const app = (await import('../../app.js')).default;
const authService = (await import('../../services/authService.js')).default;

describe('POST auth/login', () => {

    beforeEach(() => {
        authService.authenticateUser.mockClear();
    });

    it('should log in a user and redirect to / on success', async () => {
        // Подготовка {1}
        const fakeUser = { id: 1, name: "Test", email: "test@test.com" };
        authService.authenticateUser.mockResolvedValue(fakeUser);
        // Дейтвие {2}
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@test.com', password: '123password' });
        // Проверка {3}
        expect(authService.authenticateUser).toHaveBeenCalledWith('test@test.com', '123password');
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/');
    });
    it('should return 401 on failed login', async () => {
        authService.authenticateUser.mockResolvedValue(null);

        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'wrong@test.com', password: 'wrongpassword' });
        
        expect(response.statusCode).toBe(401);
    });
});

describe('POST auth/registration', () => {

    beforeEach(() => {
        authService.createUser.mockClear();
    });

    it('should create a user and redirect to /auth/login on success', async () => {
        const userData = { name: 'Test', email: 'test@example.com', password: 'password123' };
        const fakeServiceResult = { insertId: 42, affectedRows: 1 };

        authService.createUser.mockResolvedValue(fakeServiceResult);

        const response = await request(app)
            .post('/auth/registration')
            .send(userData);

        expect(authService.createUser).toHaveBeenCalledWith(userData);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/login'); 
    });

    it('should pass error to the error handler if service throws an error', async () => {
        const userData = { name: 'Test', email: 'test@example.com', password: '123' };

        const error = new Error('Email already exists');
        authService.createUser.mockRejectedValue(error);

        const response = await request(app)
            .post('/auth/registration')
            .send(userData);

        expect(authService.createUser).toHaveBeenCalledWith(userData);
        expect(response.statusCode).toBe(500);
    });
});

describe('POST auth/logout', () => {

    beforeEach(() => {
        authService.authenticateUser.mockClear();
    });
    
    it('should destroy the session and redirect to the homepage', async () => {
         const agent = request.agent(app);
            
        const fakeUser = { id: 1, name: 'Test' };
        authService.authenticateUser.mockResolvedValue(fakeUser);

        await agent
            .post('/auth/login')
            .send({ email: 'test@test.com', password: 'password123' });

        const response = await agent.post('/auth/logout');

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/');
        // Ожидаем, что сервер прислал команду на удаление cookie
        expect(response.headers['set-cookie'][0]).toMatch(/connect\.sid=;/);
    });
});