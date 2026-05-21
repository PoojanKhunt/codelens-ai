const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');
const symbolRoutes = require('./routes/symbolRoutes');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'server',
  });
});

//Symbol routes
app.use('/api/symbols', symbolRoutes);

// Project routes
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use('/api/chat', chatRoutes);