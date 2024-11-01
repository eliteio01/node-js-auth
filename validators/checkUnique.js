const db = require('../config/db'); // Adjust the import according to your project structure

// Middleware to check if username and email are unique
const checkUnique = async (req, res, next) => {
    const { username, email } = req.body;

    try {
        // Query to check if username or email already exists
        const query = 'SELECT * FROM users WHERE username = ? OR email = ?'; // Change 'users' to your actual table name
        const [results] = await db.promise().query(query, [username, email]);

        if (results.length > 0) {
            // Check if username exists
            if (results.some(user => user.username === username)) {
                return res.status(400).json({ message: 'Username is already taken' });
            }
            // Check if email exists
            if (results.some(user => user.email === email)) {
                return res.status(400).json({ message: 'Email is already registered' });
            }
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = checkUnique;
