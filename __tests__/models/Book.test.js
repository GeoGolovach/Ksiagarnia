const { jest, describe, it, expect, beforeEach } = await import('@jest/globals');

await jest.unstable_mockModule('../../config/db.js', () => ({
    connection: {
        execute: jest.fn(),
    },
}));

const { connection } = await import("../../config/db.js");
const Book = (await import("../../models/Book.js")).default;

describe('Book Model - findById', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should find book by id', async () => {
        const bookId = 1;
        const fakeBookData = { 
                id: 1, 
                name: 'Wiedźmin', 
                author: 'Andrzej Sapkowski',
                description: 'Opis książki o Wiedźminie.',
                imageUrl: '/uploads/wiedzmin.jpg',
                link: null,
                created_at: '2025-07-07T12:00:00.000Z',
                price: '49.99',
                genre: 'Fantazy',
                views: 1500,
                superprice: null
            };
        connection.execute.mockResolvedValue([[fakeBookData]]);

        const book = await Book.findById(bookId);

        expect(connection.execute).toHaveBeenCalledWith(expect.any(String), [bookId]);
        expect(book).toBeInstanceOf(Book);
        expect(book).toEqual(expect.objectContaining(fakeBookData));
    });

    it('should return null when no book is found by ID', async () => {
        connection.execute.mockResolvedValue([[]]);

        const book = await Book.findById(999);

        expect(book).toBeNull();
    });
});

describe('Book Model - findBooksByArray', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should return books from wishlist', async () => {
        const fakeBooksFromDB = [
                { id: 1, name: 'Book One' },
                { id: 5, name: 'Book Five' },
                { id: 10, name: 'Book Ten' }
            ];
        const bookIds = [1, 5, 10];
        const placeholders = '?, ?, ?';

        connection.execute.mockResolvedValue([fakeBooksFromDB]);

        const books = await Book.findBooksByArray(bookIds, placeholders);

        expect(connection.execute).toHaveBeenCalledWith(
                `SELECT * FROM books WHERE id IN (${placeholders});`,
                bookIds
            );
        expect(Array.isArray(books)).toBe(true);
        expect(books.length).toBe(3);
        expect(books[0]).toBeInstanceOf(Book);
        expect(books[0].name).toBe(fakeBooksFromDB[0].name);
    });

    it('should return null if no books are found', async () => {
        const bookIds = [998, 999];
        const placeholders = '?, ?';

        connection.execute.mockResolvedValue([[]]);

        const books = await Book.findBooksByArray(bookIds, placeholders);

        expect(books).toBeNull();
    });
});

describe('Book Model - findByAuthorAndName', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should find book or authors for search', async () => {
        const fakeSearch = 'wiedzmin';
        const fakeBooksFromDB = [
            { 
                id: 1, 
                name: 'Wiedźmin', 
                author: 'Andrzej Sapkowski',
                description: 'Opis książki o Wiedźminie.',
                imageUrl: '/uploads/wiedzmin.jpg',
                link: null,
                created_at: '2025-07-07T12:00:00.000Z',
                price: '49.99',
                genre: 'Fantazy',
                views: 1500,
                superprice: null
            },
            { 
                id: 2, 
                name: 'Wiedźmin 2', 
                author: 'Andrzej Sapkowski',
                description: 'Opis książki o Wiedźminie.',
                imageUrl: '/uploads/wiedzmin.jpg',
                link: null,
                created_at: '2025-07-07T12:00:00.000Z',
                price: '49.99',
                genre: 'Fantazy',
                views: 1500,
                superprice: null
            }
        ];

        connection.execute.mockResolvedValue([fakeBooksFromDB]);

        const books = await Book.findByAuthorAndName(fakeSearch);

        expect(connection.execute).toHaveBeenCalledWith(
                'SELECT * FROM books WHERE name LIKE ? OR author LIKE ?',
                [`%${fakeSearch}%`, `%${fakeSearch}%`]
            );
        expect(books.length).toBe(2);
        expect(books).toEqual(fakeBooksFromDB);
    });

    it('should return an empty array if no books are found', async () => {
        const fakeSearch = 'nonexistent';

        connection.execute.mockResolvedValue([[]]);

        const books = await Book.findByAuthorAndName(fakeSearch);

        expect(books).toEqual([]);
    });
});

describe('Book Model - findAndCountAll', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should fetch a paginated list of books and the total count of all books', async () => {
        const options = { limit: 12, offset: 0 };
        const fakeBooks = [
                { id: 1, name: 'Book A' },
                { id: 2, name: 'Book B' }
            ];
        const fakeCount = [{ totalCount: 150 }];

        connection.execute.mockResolvedValueOnce([fakeBooks]).mockResolvedValueOnce([fakeCount]);

        const result = await Book.findAndCountAll(options);

        expect(connection.execute).toHaveBeenCalledTimes(2);
        expect(connection.execute.mock.calls[0][0]).toContain('LIMIT ? OFFSET ?');
        expect(connection.execute.mock.calls[0][1]).toEqual([options.limit, options.offset]);
        expect(connection.execute.mock.calls[1][0]).toContain('COUNT(*)');
        expect(result.books.length).toBe(2);
        expect(result.books[0]).toBeInstanceOf(Book);
        expect(result.totalCount).toBe(150);
    });
});

describe('Book Model - sortByCategory', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should sort by category & return books + pagination', async () => {
        const fakeCategory = 'Fantazy';
        const options = { limit: 12, offset: 0 };
        const fakeCount = [{ totalCount: 150 }];
        const fakeBooks = [
                { id: 1, name: 'Book A' },
                { id: 2, name: 'Book B' }
            ];

        connection.execute.mockResolvedValueOnce([fakeCount]).mockResolvedValueOnce([fakeBooks]);

        const result = await Book.sortByCategory(fakeCategory, options.limit, options.offset);

        expect(connection.execute).toHaveBeenCalledTimes(2);
        expect(result.books.length).toBe(2);
        expect(result.totalCount).toBe(150);
        expect(connection.execute.mock.calls[0][0]).toContain('COUNT(*) AS totalCount FROM books WHERE genre = ?');
        expect(connection.execute.mock.calls[0][1]).toEqual([fakeCategory]);
        expect(connection.execute.mock.calls[1][0]).toContain('SELECT * FROM books WHERE genre = ? LIMIT ? OFFSET ?');
        expect(connection.execute.mock.calls[1][1]).toEqual([fakeCategory, options.limit, options.offset]);
        expect(result).toEqual({
                books: fakeBooks,
                totalCount: 150
            });
    });

    it('should return an empty result if category is null or undefined', async () => {
        const result = await Book.sortByCategory(null, 12, 0);

        expect(result).toEqual({ books: [], totalCount: 0 });
        expect(connection.execute).not.toHaveBeenCalled();
    });
});

describe('Book Model - filterByTop', () => {

    beforeEach(() => {
        connection.execute.mockClear();
    });

    it('should return sorted and paginated books for valid parameters', async () => {
        const options = { sortBy: 'price', sortOrder: 'ASC' };
        const limit = 12;
        const offset = 0;
        const fakeBooks = [{ id: 1, name: 'Cheapest Book', price: '9.99' }];
        const fakeCount = [{ totalCount: 150 }];

        connection.execute.mockResolvedValueOnce([fakeCount]).mockResolvedValueOnce([fakeBooks]);

        const result = await Book.filterByTop(options, limit, offset);

        expect(connection.execute).toHaveBeenCalledTimes(2);
        expect(connection.execute.mock.calls[1][0]).toBe('SELECT * FROM books ORDER BY price ASC LIMIT ? OFFSET ?;');
        expect(connection.execute.mock.calls[1][1]).toEqual([limit, offset]);
        expect(result).toEqual({
            books: fakeBooks,
            totalCount: 150
        });
    });

    it('should throw an error for an invalid sort column', async () => {
        const options = { sortBy: 'notExist', sortOrder: 'ASC' };

        await expect(Book.filterByTop(options, 12, 0))
                .rejects
                .toThrow('Invalid sort column');
            
            expect(connection.execute).not.toHaveBeenCalled();
    });

    it('should throw an error for an invalid sort order', async () => {
            const options = { sortBy: 'price', sortOrder: 'INVALID_ORDER' };
            
            await expect(Book.filterByTop(options, 12, 0))
                .rejects
                .toThrow('Invalid sort order');

            expect(connection.execute).not.toHaveBeenCalled();
    });

    it('should return an empty result if sortBy or sortOrder is missing', async () => {
            const options = { sortBy: 'price' };

            const result = await Book.filterByTop(options, 12, 0);

            expect(result).toEqual({ books: [], totalCount: 0 });
            expect(connection.execute).not.toHaveBeenCalled();
    });
});