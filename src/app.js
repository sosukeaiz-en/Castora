
const express = require('express');

const authRoutes = require('./routes/authRoutes');

const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Castora backend is running'
    });
});

// Authentication routes
app.use('/api/auth', authRoutes);

module.exports = app;
