const mongoose = require('mongoose');
const User = require("../schema/Users.js")
require('dotenv').config();


const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected!")
}


module.exports = connectDB;