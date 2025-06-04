const express = require('express');
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret';

function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
}

// Get tasks
router.get('/', auth, (req, res) => {
  db.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id], (err, results) => {
    res.json(results);
  });
});

// Add task
router.post('/', auth, (req, res) => {
  const { title, details, due_date } = req.body;
  db.query('INSERT INTO tasks (user_id, title, details, due_date) VALUES (?, ?, ?, ?)', [req.user.id, title, details, due_date], (err, result) => {
    if (err) return res.status(500).json({ msg: 'DB error' });
    res.json({ id: result.insertId, title, details, due_date, completed: false });
  });
});

// Update task
router.put('/:id', auth, (req, res) => {
  const { title, details, due_date, completed } = req.body;
  db.query('UPDATE tasks SET title=?, details=?, due_date=?, completed=? WHERE id=? AND user_id=?', [title, details, due_date, completed, req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ msg: 'DB error' });
    res.json({ msg: 'Updated' });
  });
});

// Delete task
router.delete('/:id', auth, (req, res) => {
  db.query('DELETE FROM tasks WHERE id=? AND user_id=?', [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ msg: 'DB error' });
    res.json({ msg: 'Deleted' });
  });
});

module.exports = router;