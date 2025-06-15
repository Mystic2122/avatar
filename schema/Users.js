const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    highScores: {
        E: { type: Number, default: 0 }, 
        M: { type: Number, default: 0 }, 
        H: { type: Number, default: 0 }
  }
})

module.exports = mongoose.model("users", userSchema)