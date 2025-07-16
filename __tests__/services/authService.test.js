const { jest, it, beforeEach, describe, expect } = await import('@jest/globals');

await jest.unstable_mockModule('../../models/User.js', () => ({
    default: {
        login: jest.fn(),
    }
}));

const User = (await import('../../models/User.js')).default;
const authService = (await import('../../services/authService.js')).default;

describe('Auth Service - authenticate User', () => {

    beforeEach(() => {
        User.login.mockClear();
    });

    it('should call User.login and return the user on success', async () => {
        const fakeUserInstance = {
            id: 42,
            name: 'Test',
            email: 'test@test.com',
            role: 'user',
        };
        User.login.mockResolvedValue(fakeUserInstance);

        const result = await authService.authenticateUser('test@test.com', 'some_password');

        expect(User.login).toHaveBeenCalledWith('test@test.com', 'some_password');
        expect(result).toEqual(fakeUserInstance);
    });
    it('should call User.login and return null on failure', async () => {
        User.login.mockResolvedValue(null);

        const result = await authService.authenticateUser('wrong@test.com', 'wrong_password');

        expect(User.login).toHaveBeenCalledWith('wrong@test.com', 'wrong_password');
        expect(result).toBeNull();
    });
});