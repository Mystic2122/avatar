const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    highScores: {
        easy: { type: Number, default: 0 }, 
        medium: { type: Number, default: 0 }, 
        hard: { type: Number, default: 0 }
  }
})

module.exports = mongoose.model("users", userSchema)