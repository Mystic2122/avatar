const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../schema/Users');

const router = express.Router();

// GET /login → show the form
router.get('/', (req, res) => {
  res.render('login');
});

// POST /login → handle login logic
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // 1. Find the user
  const user = await User.findOne({ username });
  if (!user) {
    return res.render('login', { error: "Invalid username or password" });
  }

  // 2. Check password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.render('login', { error: "Incorrect password" });
  }

  // ✅ Login success!
  console.log("✅ Login successful for", username);
  res.redirect(`/game?username=${encodeURIComponent(username)}`);
});

module.exports = router;
