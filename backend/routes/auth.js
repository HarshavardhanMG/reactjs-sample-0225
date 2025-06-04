const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret';

// Signup
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (results.length) return res.status(400).json({ msg: 'Email exists' });
    const hash = bcrypt.hashSync(password, 10);
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash], (err, result) => {
      if (err) return res.status(500).json({ msg: 'DB error' });
      res.json({ msg: 'Signup success' });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (!results.length) return res.status(400).json({ msg: 'Invalid credentials' });
    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  });
});

module.exports = router;