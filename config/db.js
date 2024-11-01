// config/db.js
const mysql = require('mysql2'); // Import MySQL client
require('dotenv').config(); // Load environment variables

// Create MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Connect to the database
db.connect(err => {
    if (err) {
        throw err; // Handle connection errors
    }
    console.log('MySQL connected...'); // Log successful connection
});

module.exports = db; // Export the connection
