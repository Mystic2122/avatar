const express = require('express');
const router = express.Router();
const Image = require('../schema/Image');
const User = require('../schema/Users');
const Episode = require('../schema/Episode')


// GET /game
router.get('/', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const username = req.session.user.username;
  const difficulty = req.query.difficulty.toLowerCase() || 'easy';

  console.log("🟢 /game GET hit");
  console.log("🔍 User:", username, "| Difficulty:", difficulty);

  try {
    const user = await User.findOne({ username });
    const image = await Image.aggregate([
      { $match: { difficulty } },
      { $sample: { size: 1 } }
    ]);

    if (!image || image.length === 0) {
      return res.send("⚠️ No images available for this difficulty.");
    }

    const episodes = await Episode
      .find({}, 'code title season episode_number')
      .sort({ season: 1, episode_number: 1 })
      .lean();


    if (req.session.score === undefined) {
      req.session.score = 0;
    }

    const highscore = user.highScores?.[difficulty] || 0;

    res.render('game', {
      username,
      difficulty,
      image: image[0],
      episodes,
      score: req.session.score,
      highscore,
      wrong: false,
      correctAnswerId: image[0].answer,
      correctAnswerTitle: image[0].title
    });

  } catch (err) {
    console.error("❌ Error in GET /game:", err);
    res.status(500).send("Internal server error");
  }
});

// POST /game
router.post('/', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const guessedId = req.body.guess;
  const correctId = req.body.correctAnswer;
  const difficulty = req.body.difficulty || 'easy';
  const username = req.session.user.username;

  const isCorrect = guessedId === correctId;
  const currentScore = req.session.score || 0;

  if (isCorrect) {
    req.session.score = currentScore + 1;
    return res.redirect(`/game?difficulty=${difficulty}`);
  }

  // ⛔ Wrong answer – check and update high score if needed
try {
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).send("User not found.");
  }

  const previousHigh = user.highScores?.[difficulty] || 0;
  if (currentScore > previousHigh) {
    user.highScores[difficulty] = currentScore;
    await user.save();
    console.log(`🏆 New high score for ${difficulty}: ${currentScore}`);
  }

  req.session.score = 0;

 
  const newImage = await Image.aggregate([
    { $match: { difficulty } },
    { $sample: { size: 1 } }
  ]);

  const episodes = await Episode
      .find({}, 'code title season episode_number')
      .sort({ season: 1, episode_number: 1 })
      .lean();

  const highscore = user.highScores?.[difficulty] || 0;
  res.render('game', {
      username,
      difficulty,
      image: newImage[0],
      episodes,
      score: req.session.score,
      highscore,
      wrong: true,
      correctAnswerId: newImage[0].answer,
      correctAnswerTitle: newImage[0].title
    });
} catch (err) {
  console.error("❌ Error updating high score:", err);
  res.status(500).send("Internal server error");
}
});

module.exports = router;
