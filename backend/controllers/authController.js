const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const mongoose = require('mongoose');

// Función auxiliar para sanitizar entrada
const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return '';
  }
  return input
    .replace(/[\$\{\}\[\]\(\)]|(\$eq)|(\$ne)|(\$gt)|(\$lt)|(\$gte)|(\$lte)|(\$in)|(\$nin)|(\$or)|(\$and)|(\$not)|(\$nor)|(\$exists)/g, '')
    .trim();
};

const validateRequiredFields = (fields) => {
  return Object.entries(fields).every(([key, value]) => {
    return value !== undefined && 
           value !== null && 
           value.toString().trim() !== '' &&
           typeof value === 'string';
  });
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!validateRequiredFields({ username, password })) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const sanitizedUsername = sanitizeInput(username);

    if (sanitizedUsername.length < 3 || sanitizedUsername.length > 20) {
      return res.status(400).json({ message: 'Username must be between 3 and 20 characters' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.findOne({ username: sanitizedUsername }).exec();
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({
      username: sanitizedUsername,
      password: password
    });

    await user.save();
    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: 'An unexpected error occurred' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username }); // No logueamos la contraseña

    if (!validateRequiredFields({ username, password })) {
      console.log('Invalid fields provided');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const sanitizedUsername = sanitizeInput(username);
    console.log('Sanitized username:', sanitizedUsername);

    const user = await User.findOne({ username: sanitizedUsername }).select('+password').exec();
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('No user found with username:', sanitizedUsername);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password did not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '24h' });
    console.log('Token generated successfully');
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: 'An unexpected error occurred' });
  }
};
