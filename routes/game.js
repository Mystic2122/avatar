const express = require('express');
const router = express.Router();
const Image = require('../schema/Image'); // Adjust path if needed

// GET /game
router.get('/', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const username = req.session.user.username;

  // ✅ Map full difficulty names to single-letter codes
  const diffMap = {
    easy: 'E',
    medium: 'M',
    hard: 'H'
  };

  const rawDifficulty = req.query.difficulty?.toLowerCase() || 'easy';
  const difficulty = diffMap[rawDifficulty] || 'E';

  console.log("🟢 /game route hit");
  console.log("🔍 Username:", username);
  console.log("🔍 Raw difficulty:", rawDifficulty);
  console.log("🎯 Mapped difficulty:", difficulty);

  try {
    const image = await Image.aggregate([
      { $match: { difficulty } },
      { $sample: { size: 1 } }
    ]);

    if (!image || image.length === 0) {
      return res.send("⚠️ No images available for this difficulty.");
    }

    res.render('game', {
      username,
      difficulty,
      image: image[0]
    });

  } catch (err) {
    console.error("❌ Error fetching image:", err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
