 import { connection } from '../config/db.js';
 import bcrypt from 'bcrypt';

 class User {
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.lastname = user.lastname;
        this.email = user.email;
        this.password = user.password;
        this.isAdmin = user.idAdmin;
        this.phone = user.phone;
        this.address = user.address;
        this.avatar_path = user.avatar_path;
    }



    /**
     * Сравнение предоставленного пароля с хешем в базе данных
     * @param {string} plainTextPassword - Пароль в открытом виде
     * @returns {Promise<boolean>} - true, если пароли совпадают
     */

    async comparePassword(plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    }

    
// --- Статические методы для работы с базой данных ---

    /**
     * Создание нового пользователя в базе данных
     * @param {object} userData - Данные пользователя (username, email, password)
     * @returns {Promise<object>} - Результат вставки из БД
     */

    static async create(userData) {
        const { name, lastname, email, password, avatar_path } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (name, lastname, email, password, avatar_path) VALUES (?, ?, ?, ?, ?)';
        
        try {
            const [results] = await connection.execute(sql, [name, lastname, email, hashedPassword, avatar_path || 'uploads/avatar.png']);
            return results;
        } catch (err) {
            console.error('Ошибка при создании пользователя:', err);
            throw err;
        }

    }

    /**
     * Поиск пользователя по email
     * @param {string} email - Email пользователя
     * @returns {Promise<User|null>} - Найденный пользователь или null
     */

    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?;';
        try {

            const [rows] = await connection.execute(sql, [email]);

            if (rows.length === 0) {
                return null;
            }

            return new User(rows[0]);

        } catch (err) {

            console.error('Ошибка при поиске пользователя по email:', err);
            throw err;

        }
    }

    /**
     * Находит одного пользователя по ID.
     * @param {number} id 
     * @returns {Promise<User|null>}
     */

    static async findById(id) {
        const sql = 'SELECT  * FROM users WHERE id = ?;';
            const [rows] = await connection.execute(sql, [id]);

            if (rows.length === 0) {
                return null;
            }

            return new User(rows[0]);
    }

    /**
     * 
     * @param {number} userId 
     * @param {object} userData 
     * @returns {Promise<object>}
     */

    static async update(userId, userData) {
        const fields = Object.keys(userData);
        const values = Object.values(userData);

        if(fields.length === 0 ) {
            throw new Error('Нет данных для обновления.');
        }

        const updatedData = fields.map(field => `${field} = ?`).join(', ');

        const sql = `UPDATE users SET ${updatedData} WHERE id = ?`;

        const queryValues = [...values, userId]
        const [rows] = await connection.execute(sql, queryValues);
        return rows;
    }


    /**
     * ЛОГИН (Аутентификация)
     * @param {string} email - Email, который ввел пользователь.
     * @param {string} password - Пароль, который ввел пользователь.
     * @returns {Promise<User|null>} - Возвращает экземпляр пользователя в случае успеха или null в случае неудачи.
     */

    static async login(email, password) {

        const user = await this.findByEmail(email);

        if (!user) {
            return null; 
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return null;
        }

        return user;
    }

 }

 export default User;
