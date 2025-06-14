const express = require('express');
const connectDB = require('./routes/db');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const session = require('express-session');
require('dotenv').config();



const app = express();

app.set('view engine', 'ejs')
app.use(express.static("public"))


app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET, // change this to a strong, private string
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using HTTPS
}));

app.get("/", (req, res) => { //request and response
  console.log('Here')
  res.render('index')
}) 

app.get('/difficulty', (req, res) => {
  res.render('difficulty');
});

const gameRouter = require('./routes/game'); // adjust path if needed
app.use('/game', gameRouter);




const User = require('./schema/Users');

const dbRouter = require("./routes/db")

connectDB();

app.use("/db", dbRouter)
app.use("/signup", signupRouter);
app.use('/login', loginRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
