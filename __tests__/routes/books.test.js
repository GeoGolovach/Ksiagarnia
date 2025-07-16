const { jest, describe, it, expect, beforeEach } = await import('@jest/globals');

await jest.unstable_mockModule('../../services/bookService.js', () => ({
    default: {
        searchBook: jest.fn(),
        getBooksForPage: jest.fn(),
        sortBooksByCategories: jest.fn(),
        filterBooksByTop: jest.fn(),
    }
}));

const request = (await  import('supertest')).default;
const app = (await import('../../app.js')).default;
const bookService = (await import('../../services/bookService.js')).default;

describe('POST books/search', () => {

    beforeEach(() => {
        bookService.searchBook.mockClear();
    });

    it('should return a JSON array of books on successful search', async () => {

        const searchQuery = { search: 'wiedźmin' };
        const booksFromService = [
            { id: 1, name: 'Test1', author: 'Test1' },
            { id: 2, name: 'Test2', author: 'Test2' },
        ];
        bookService.searchBook.mockResolvedValue(booksFromService);

        const response = await request(app)
            .post('/books/search')
            .send(searchQuery);

        expect(bookService.searchBook).toHaveBeenCalledWith(searchQuery);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(booksFromService);
    });

    it('should return a 500 status if the service throws an error', async () => {
        const searchQuery = { search: 'error' };

        const dbError = new Error('Database connection failed');
        bookService.searchBook.mockRejectedValue(dbError);

        const response = await request(app)
            .post('/books/search')
            .send(searchQuery);
        
        expect(bookService.searchBook).toHaveBeenCalledWith(searchQuery);
        expect(response.statusCode).toBe(500);

    });
});

describe('POST books/filter', () => {

    beforeEach(() => {
        bookService.filterBooksByTop.mockClear();
    });

    it('should return paginated data from the service on success', async () => {
        const filterOptions = { sortBy: 'price', sortOrder: 'ASC' };
        const fakeServiceResponse = {
            books: [{ id: 1, name: 'Cheapest Book' }],
            currentPage: 1,
            totalPages: 5
        };
        bookService.filterBooksByTop.mockResolvedValue(fakeServiceResponse);

        const response = await request(app)
            .post('/books/filter')
            .send(filterOptions);

        expect(bookService.filterBooksByTop).toHaveBeenCalledWith(filterOptions);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(fakeServiceResponse);
    });

    it('should return a 500 status if the service throws an error', async () => {
        const filterOptions = { sortBy: 'invalid_column', sortOrder: 'ASC' };

        const error = new Error('Invalid filter column');
        bookService.filterBooksByTop.mockRejectedValue(error);

        const response = await request(app)
            .post('/books/filter')
            .send(filterOptions);

        expect(bookService.filterBooksByTop).toHaveBeenCalledWith(filterOptions);
        expect(response.statusCode).toBe(500);
    });
});

describe('POST books/filter-category', () => {

    beforeEach(() => {
        bookService.sortBooksByCategories.mockClear();
    });

    it('should return 200 and paginated data on success', async () => {
        const category = 'Fantazy';
        const fakeServiceResponse = {
            books: [{ id: 1, name: 'Cheapest Book' }],
            currentPage: 1,
            totalPages: 5
        };

        bookService.sortBooksByCategories.mockResolvedValue(fakeServiceResponse);

        const response = await request(app)
            .post('/books/filter-category')
            .send({ category: category, page: 1 });

        expect(bookService.sortBooksByCategories).toHaveBeenCalledWith(category, page = 1);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(fakeServiceResponse);
    });

    it('should return 500 if service throws an error', async () => {
        const category = 'Error';

        const error = new Error('Error Invalid sort column');
        bookService.sortBooksByCategories.mockRejectedValue(error);

        const response = await request(app)
            .post('/books/filter-category')
            .send({ category: category, page: 0 });

        expect(bookService.sortBooksByCategories).toHaveBeenCalledWith( category, page = 0 );
        expect(response.statusCode).toBe(500);
    });
});