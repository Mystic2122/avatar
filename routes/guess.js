const express = require('express');
const router = express.Router();
const Image = require('../schema/Image'); // or wherever your model is

router.post('/', async (req, res) => {
  const { guess, imageId } = req.body;

  try {
    const image = await Image.findById(imageId);
    if (!image) return res.status(404).send("Image not found");

    const isCorrect = guess === image.answer;

    if (isCorrect) {
      req.session.score = (req.session.score || 0) + 1;
      // Redirect to /game to continue the streak
      return res.redirect(`/game?difficulty=${image.difficulty}`);
    } else {
      // Game over: clear score, show result
      const finalScore = req.session.score || 0;
      req.session.score = 0; // reset for next round

      return res.render('result', {
        correct: false,
        guess,
        correctAnswer: image.answer,
        finalScore
      });
    }

  } catch (err) {
    console.error("❌ Error in /guess:", err);
    res.status(500).send("Server error");
  }
});


module.exports = router;
