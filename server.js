const express = require('express');
const connectDB = require('./routes/db');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');

const app = express();

app.set('view engine', 'ejs')
app.use(express.static("public"))


app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => { //request and response
  console.log('Here')
  res.render('index')
}) 

app.get('/difficulty', (req, res) => {
  res.render('difficulty');
});

app.get('/game', (req, res) => {
  console.log("🟢 /game route hit");
  const username = req.query.username || 'Player';
  const difficulty = req.query.difficulty || 'easy';
  res.render('game', { username, difficulty });
});




const User = require('./schema/Users');

const dbRouter = require("./routes/db")

connectDB();

app.use("/db", dbRouter)
app.use("/signup", signupRouter);
app.use('/login', loginRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
