import User from '../models/User.js';

// export async function getAllBooks() {
//   const [books] = await connection.query('SELECT * FROM books LIMIT 12');
//   return books;
// }

  const createUser = async (userData) => {
    try {
      const newUser = await User.create(userData);
      return newUser;
    } catch (err) {
      throw err;
    }
  }

  const authenticateUser = async (email, password) => {
    
      const user = await User.login(email, password);
      return user;

    
  }
  

export default { 
  createUser,
  authenticateUser,
 };