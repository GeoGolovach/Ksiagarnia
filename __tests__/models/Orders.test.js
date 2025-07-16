const { jest, describe, it, expect, beforeEach } = await import('@jest/globals');

await jest.unstable_mockModule('../../config/db.js', () => ({
    connection: {
        execute: jest.fn(),
    },
}));

const { connection } = await import('../../config/db.js');
const Orders = (await import('../../models/Orders.js')).default;

describe('Orders Model - findOrdersByUser', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should return an array of book_ids for a user who has orders', async () => {
        const fakeUserId = 1;
        const fakeOrdersFromDB = [
            { id: 10, user_id: 1, book_id: 101, quantity: 1 },
            { id: 11, user_id: 1, book_id: 205, quantity: 2 }
        ];

        connection.execute.mockResolvedValue([fakeOrdersFromDB]);

        const bookIds = await Orders.findOrdersByUser(fakeUserId);

        expect(connection.execute).toHaveBeenCalledWith(
                'SELECT * FROM orders WHERE user_id = ?',
                [fakeUserId]
            );
        expect(bookIds).toEqual([101, 205]);
    });

    it('should return an empty array for a user with no orders', async () => {
        const userId = 2;

        connection.execute.mockResolvedValue([[]]);

        const bookIds = await Orders.findOrdersByUser(userId);

        expect(bookIds).toEqual([]);
    });
});

describe('Orders Model - findByUserIdAndBookId', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should return the specific order row if found', async () => {
        const fakeUserId = 1;
        const fakeBookId = 1;
        const booksFromDB = [
            { id: 10, user_id: 1, book_id: 101, quantity: 1 },
            { id: 11, user_id: 1, book_id: 205, quantity: 2 }
        ];

        connection.execute.mockResolvedValue([booksFromDB]);

        const fakeOrders = await Orders.findByUserIdAndBookId(fakeUserId, fakeBookId);

        expect(connection.execute).toHaveBeenCalledWith(
                'SELECT * FROM orders WHERE user_id = ? AND book_id = ?;',
                [fakeUserId, fakeBookId]
            );
        expect(fakeOrders).toEqual({ id: 10, user_id: 1, book_id: 101, quantity: 1 });
    });

    it('should return undefined if no order is found', async () => {
        connection.execute.mockResolvedValue([[]]);

        const result = await Orders.findByUserIdAndBookId(1, 999);

        expect(result).toBeUndefined();
    });
});

describe('Orders Model - deleteFromOrders', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should return true when an order is successfully deleted', async () => {
        const fakeUserId = 1;
        const fakeBookId = 1;
        const dataFromDB = { affectedRows: 1};

        connection.execute.mockResolvedValue([dataFromDB]);

        const result = await Orders.deleteFromOrders(fakeUserId, fakeBookId);

        expect(connection.execute).toHaveBeenCalledWith(
                'DELETE FROM orders WHERE user_id = ? AND book_id = ?;',
                [fakeUserId, fakeBookId]
            );
        expect(result).toBe(true);
    });

    it('should return false when no order was found to delete', async () => {
        const fakeUserId = 1;
        const fakeBookId = 999;
        
        const dbResult = { affectedRows: 0 };
        connection.execute.mockResolvedValue([dbResult]);

        const result = await Orders.deleteFromOrders(fakeUserId, fakeBookId);

        expect(result).toBe(false);
    });
});