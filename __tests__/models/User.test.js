const { jest, describe, it, expect, beforeEach } = await import('@jest/globals');

await jest.unstable_mockModule('../../config/db.js', () => ({
    connection: {
        execute: jest.fn(),
    },
}));

await jest.unstable_mockModule('bcrypt', () => ({
    default: {
        hash: jest.fn(),
    }
}));

const { connection } = await import("../../config/db.js");
const User = (await import("../../models/User.js")).default;
const bcrypt = (await import('bcrypt')).default;

describe('User Model - login', () => {

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

describe('User Model - create', () => {

    beforeEach(() => {
        connection.execute.mockClear();
        bcrypt.hash.mockClear();
    });

    it('should hash the password and insert a new user, returning the db result', async () => {
        const userData = {
            name: 'Test',
            lastname: 'Test',
            email: 'test@test.com',
            password: 'password123',
            avatar_path: 'not_default'
        };
        const hashedPassword = 'hashed_password_123abc';
        const dbResult = { insertId: 42, affectedRows: 1 };

        connection.execute.mockResolvedValue([dbResult]);
        bcrypt.hash.mockResolvedValue(hashedPassword);

        const result = await User.create(userData);

        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(connection.execute).toHaveBeenCalledWith(expect.any(String), ['Test', 'Test', 'test@test.com', hashedPassword, 'not_default']);
        expect(result).toBe(dbResult);
    });

    it('should use a default avatar path if none is provided', async () => {
        const userData = {
            name: 'Test',
            lastname: 'Test',
            email: 'test@test.com',
            password: 'password123'
        };
        const hashedPassword = 'hashed_password_123abc';
        const dbResult = { insertId: 42, affectedRows: 1 };

        connection.execute.mockResolvedValue([dbResult]);
        bcrypt.hash.mockResolvedValue(hashedPassword);

        await User.create(userData);

        expect(connection.execute).toHaveBeenCalledWith(expect.any(String), ['Test', 'Test', 'test@test.com', hashedPassword, 'uploads/avatar.png'])
    });
});

describe('User Model - findByEmail', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should find user by email', async () => {
        const email = 'test@test.com';
        const fakeUserFromDB = {
            id: 1,
            name: 'Test',
            lastname: 'Test',
            email: 'test@test.com',
            password: 'hashed_password_123abc'
        };

        connection.execute.mockResolvedValue([[fakeUserFromDB]]);
        
        const user = await User.findByEmail(email);

        expect(connection.execute).toHaveBeenCalledWith(expect.any(String), ['test@test.com']);
        expect(user).toBeInstanceOf(User);
        expect(user.id).toBe(1);
        expect(user.email).toBe('test@test.com');
    });

    it('should return null if no user with the email exists', async () => {
        const email = 'test@test.com';

        connection.execute.mockResolvedValue([[]]);

        const user = await User.findByEmail(email);

        expect(user).toBeNull();
    });
});

describe('User Model - update', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should update profile by userId & userData', async () => {
        const userId = 1;
        const userData = {
            name: 'Test',
            email: 'test@test.com',
            phone: '+123456789',
            address: 'testaddress',
        };
        const dbResult = { changedRows: 1, affectedRows: 1 };

        connection.execute.mockResolvedValue([dbResult]);

        const result = await User.update(userId, userData);

        expect(connection.execute).toHaveBeenCalledWith(
                'UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
                [userData.name, userData.email, userData.phone, userData.address, userId]
            );
            expect(result).toBe(dbResult);
    });

    it('should throw an error if no data is provided for update', async () => {
        const userId = 1;
        const userData = {};

        await expect(User.update(userId, userData))
            .rejects
            .toThrow('Нет данных для обновления.');
            expect(connection.execute).not.toHaveBeenCalled();
    });
});

describe('User Model - uploadAvatar', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should update avatar_path by userId & filePath', async () => {
        const userId = 1;
        const avatar_path = 'newAvatarPath';

        connection.execute.mockResolvedValue({ affectedRows: 1 });

        const result = await User.uploadAvatar(userId, avatar_path);

        expect(connection.execute).toHaveBeenCalledWith(
                'UPDATE users SET avatar_path = ? WHERE id = ?',
                [avatar_path, userId]
            );
        expect(result).toBe(avatar_path);
    });
});