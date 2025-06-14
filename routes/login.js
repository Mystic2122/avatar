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

  const user = await User.findOne({ username });
  if (!user) {
    return res.render('login', { error: "Invalid username or password" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.render('login', { error: "Incorrect password" });
  }

  // ✅ Store the user in the session
  req.session.user = { username: user.username };
  console.log("✅ Login successful for", username);

  // ✅ Now no need to pass ?username= in the URL
  res.redirect('/difficulty');
});


module.exports = router;
