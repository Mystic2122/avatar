const express = require('express');
const connectDB = require('./db');

const app = express();

connectDB(); // Connect to MongoDB before starting the server

app.get('/', (req, res) => {
  res.send('Hello from your MongoDB-connected app!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
