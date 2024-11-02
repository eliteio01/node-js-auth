// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const schema = require('../validators/userValidation');
const checkUnique = require('../validators/checkUnique');


// Secret key for JWT (you should keep this secure and not hard-code it in production)
const JWT_SECRET = process.env.JWT_SECRET;

// User Registration Endpoint
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        console.log(req.body);

        const { error } = schema.validate({ username, email, password });

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }


        // Set the salt rounds (number of hashing iterations)
        const saltRounds = 10; // Example: Adjust as needed for security requirements

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Check for unique username and email
        // checkUnique(req, res, async () => {
            // Continue with registration logic if all validations pass
            db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ id: results.insertId, username,  result: results }); // Respond with created user data
            });

        // });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User Login Endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password); // Compare passwords
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' }); // Invalid password
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token }); // Respond with the token
    });
});

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from headers
    if (!token) {
        return res.sendStatus(403); // Forbidden if no token
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        req.user = user; // Store user info in request
        next(); // Proceed to the next middleware or route
    });
};

// Protecting the Get All Users Endpoint
router.get('/', authenticateJWT, (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results); // Respond with list of users
    });
});

// Other endpoints can also use the authenticateJWT middleware as needed...

// Export the router
module.exports = router;


// everything is a test.