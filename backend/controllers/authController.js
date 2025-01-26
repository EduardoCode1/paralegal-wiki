const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const sanitizeInput = (input) => {
  return typeof input === 'string' 
    ? input.replace(/[<>]/g, '').trim() 
    : '';
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const sanitizedUsername = sanitizeInput(username);

    const existingUser = await User.findOne({ username: sanitizedUsername });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({ username: sanitizedUsername, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Registration error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const sanitizedUsername = sanitizeInput(username);

    const user = await User.findOne({ username: sanitizedUsername }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};