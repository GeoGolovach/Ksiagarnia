const { jest, describe, it, expect, beforeEach } = await import('@jest/globals');

await jest.unstable_mockModule('../config/db.js', () => ({
    connection: {
        execute: jest.fn(),
    },
}));

const { connection } = await import("../config/db.js");
const User = (await import("./User.js")).default;

describe('User Model', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should find a user by ID and return a User instance', async () => {
        // подготовка {1}
        const fakeUser = { id: 1, name: 'Test User', email: 'test@test.com' };
        // Говорим нашей фальшивой БД, что при вызове execute она должна вернуть fakeUser
        connection.execute.mockResolvedValue([[fakeUser]]);
        // действие {2}
        const user = await User.findById(1);
        // проверка {3}
        expect(user).toBeInstanceOf(User);
        expect(user.id).toBe(1);
        expect(user.name).toBe('Test User');
        expect(user.email).toBe('test@test.com');
    });

    it('should return null if user is not found', async () => {
        // 1. Подготовка: теперь наша БД возвращает пустой массив
        connection.execute.mockResolvedValue([[]]);
        // 2. Действие
        const user = await User.findById(999);
        // 3. Проверка
        expect(user).toBeNull();
    });
});