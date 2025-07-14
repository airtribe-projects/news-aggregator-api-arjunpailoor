const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/auth.js');
const users = require('../users');

const router = express.Router();
const SECRET_KEY = 'keyAirtribe';

const axios = require('axios');
const NEWS_API_KEY = '46bc80dd1460480b8a759f4024a345d0';

// POST /register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Email format (basic check)
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(username)) {
    return res.status(400).json({ message: 'Invalid username format, username must be of email format eg. abc@def.xyz' });
  }

  // Password length
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully' });
});


// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ username }, SECRET_KEY);
  res.json({ token });
});

// GET /preferences
router.get('/preferences', authenticate, (req, res) => {
  const user = users.find(u => u.username === req.user.username);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ preferences: user.preferences || [] });
});

// PUT /preferences
// PUT /preferences
router.put('/preferences', authenticate, (req, res) => {
  const { preferences } = req.body;

  // Validate preferences
  if (!Array.isArray(preferences)) {
    return res.status(400).json({ message: 'Preferences must be an array' });
  }

  const invalid = preferences.some(p => typeof p !== 'string' || p.trim() === '');
  if (invalid) {
    return res.status(400).json({ message: 'Each preference must be a non-empty string' });
  }

  const user = users.find(u => u.username === req.user.username);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.preferences = preferences;
  res.json({ message: 'Preferences updated', preferences });
});

// GET /news
router.get('/news', authenticate, async (req, res) => {
  const user = users.find(u => u.username === req.user.username);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const preferences = user.preferences || [];

  if (preferences.length === 0) {
    return res.status(400).json({ message: 'No preferences set' });
  }

  try {
    const categoryQuery = preferences.join(' OR ');
    const response = await axios.get(`https://newsapi.org/v2/everything`, {
      params: {
        q: categoryQuery,
        apiKey: NEWS_API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 10
      }
    });

    res.json({ articles: response.data.articles });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Failed to fetch news' });
  }
});


module.exports = router;
