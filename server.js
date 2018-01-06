const path = require('path');
const db = require('./src/db.js')('./data.db');
const express = require('express');

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(3000, () => {console.log("Listening on port 3000.");});
