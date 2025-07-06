const { jest, describe, it, expect, beforeEach } = await import('@jest/globals');

await jest.unstable_mockModule('../services/authService.js', () => ({
    default: {
        authenticateUser: jest.fn(),
    }
}));

const request = (await  import('supertest')).default;
const app = (await import('../app.js')).default;
const authService = (await import('../services/authService.js')).default;

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