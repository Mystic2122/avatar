const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('./routes/db');
const signupRouter = require('./routes/signup');


const app = express();

app.set('view engine', 'ejs')
app.use(express.static("public"))

app.get("/", (req, res) => { //request and response
  console.log('Here')
  res.render('index', { text: "World"})
}) 

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

const dbRouter = require("./routes/db")

connectDB();

app.use("/db", dbRouter)
app.use("/users", signupRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});



// Comment :)