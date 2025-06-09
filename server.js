const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('./routes/db');

const app = express();

app.set('view engine', 'ejs')
app.use(express.static("views"))

app.get("/", (req, res) => { //request and response
  console.log('Here')
  res.render('index', { text: "World"})
}) 

const userRouter = require("./routes/users")
const dbRouter = require("./routes/db")
connectDB();

app.use("/db", dbRouter)
app.use("/users", userRouter)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});