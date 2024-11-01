// Load required packages
const express = require('express'); // Import Express
const bodyParser = require('body-parser'); // Import body-parser
const cors = require('cors'); // Import CORS
require('dotenv').config(); // Load environment variables

// Create an instance of Express
const app = express();
const PORT = process.env.PORT || 3000; // Set the port

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies



// Import routes
const userRoutes = require('./routes/userRoute.js'); // Import user routes

// Use routes
app.use('/api/users', userRoutes); // Prefix the routes with /api/users


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log server status
});
