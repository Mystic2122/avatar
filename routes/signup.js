const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../schema/Users');

const router = express.Router();

router.post('/signup', async (req, res) => {
  console.log("🔥 Signup route hit");
  console.log("Received body:", req.body);

  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send('Passwords do not match');
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send("Username already taken"); // 409 Conflict
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed });
    await newUser.save();
    console.log("✅ User saved to database");
    res.send("User registered!");
  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).send('Database Error');
  }
});


module.exports = router;
