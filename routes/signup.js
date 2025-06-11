// routes/signup.js
const express = require('express');
const router = express.Router();

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  // Save to DB, validate, etc.
  res.send('User signed up');
});

module.exports = router;
