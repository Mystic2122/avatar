const mongoose = require('mongoose');

const epSchema = new mongoose.Schema({
  code:           { type: String, required: true, unique: true },
  title:          { type: String, required: true },
  season:         { type: Number, required: true },
  episode_number: { type: Number, required: true }
});


module.exports = mongoose.model('Episode', epSchema)