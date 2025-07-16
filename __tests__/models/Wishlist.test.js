const { jest, describe, it, expect, beforeEach } = await import('@jest/globals');

await jest.unstable_mockModule('../../config/db.js', () => ({
    connection: {
        execute: jest.fn(),
    },
}));

const { connection } = await import('../../config/db.js');
const Wishlist = (await import('../../models/Wishlist.js')).default;

describe('Wishlist Model - addByUserIdAndBookId', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should execute an INSERT query with the correct user and book IDs', async () => {
        const fakeUserId = 1;
        const fakeBookId = 1;
        const resultFromDB = [
            { affectedRows: 1 },
        ];

        connection.execute.mockResolvedValue([resultFromDB]);

        const result = await Wishlist.addByUserIdAndBookId(fakeUserId, fakeBookId);

        expect(connection.execute).toHaveBeenCalledWith(
                'INSERT INTO wishlist (user_id, book_id) VALUES (?, ?);',
                [fakeUserId, fakeBookId]
        );
        expect(result).toEqual(resultFromDB);
    });
});

describe('Wishlist Model - findByUserIdAndBookId', () => {
   
    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should return the wishlist entry object if found', async () => {
        const fakeUserId = 1;
        const fakeBookId = 101;
        const wishlistFromDB = { id: 10, user_id: fakeUserId, book_id: fakeBookId, created_at: '2025-06-29 20:19:28' };

        connection.execute.mockResolvedValue([[wishlistFromDB]]);

        const wishlist = await Wishlist.findByUserIdAndBookId(fakeUserId, fakeBookId);

        expect(connection.execute).toHaveBeenCalledWith(
                'SELECT * FROM wishlist WHERE user_id = ? AND book_id = ?;',
                [fakeUserId, fakeBookId]
        );
        expect(wishlist).toEqual(wishlistFromDB);
    });

    it('should return undefined if no entry is found', async () => {
        connection.execute.mockResolvedValue([[]]);

        const result = await Wishlist.findByUserIdAndBookId(1, 999);

        expect(result).toBeUndefined();
    });
});

describe('Wishlist Model - findBookIdsByUser', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should return an array of book IDs for a user with wishlist items', async () => {
        const fakeUserId = 1;
        const wishlistFromDB = [
            { id: 10, user_id: fakeUserId, book_id: 1, created_at: '2025-06-29 20:19:28' },
            { id: 12, user_id: fakeUserId+1, book_id: 2, created_at: '2025-06-29 20:19:28' }
        ];

        connection.execute.mockResolvedValue([wishlistFromDB]);

        const resultArray = await Wishlist.findBookIdsByUser(fakeUserId);

        expect(connection.execute).toHaveBeenCalledWith(
                'SELECT * FROM wishlist WHERE user_id = ?;',
                [fakeUserId]
        );
        expect(resultArray).toEqual([1, 2]);
    });

    it('should return an empty array for a user with no wishlist items', async () => {
        const userId = 2;
        connection.execute.mockResolvedValue([[]]);

        const result = await Wishlist.findBookIdsByUser(userId);

        expect(result).toEqual([]);
    });
});

describe('Wishlist Model - deleteFromWishlist', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should return true when an item is successfully deleted', async () => {
        const fakeUserId = 1;
        const fakeBookId = 101;
        const wishlistFromDB = [
            { affectedRows: 1 },
        ];

        connection.execute.mockResolvedValue(wishlistFromDB);

        const result = await Wishlist.deleteFromWishlist(fakeUserId, fakeBookId);

        expect(connection.execute).toHaveBeenCalledWith(
                'DELETE FROM wishlist WHERE user_id = ? AND book_id = ?;',
                [fakeUserId, fakeBookId]
        );
        expect(result).toBe(true);
    });

    it('should return false when no item was found to delete', async () => {
        const dbResult = { affectedRows: 0 };
        connection.execute.mockResolvedValue([dbResult]);

        const wasDeleted = await Wishlist.deleteFromWishlist(1, 999);

        expect(wasDeleted).toBe(false);
    });
});