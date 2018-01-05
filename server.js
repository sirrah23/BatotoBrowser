const path = require('path');
const db = require('./src/db.js')('./data.db');
const express = require('express');

const app = express();
app.use(express.static('public'));

const img_dir = 'images';

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  db.readAllData()
    .then(mangas => {
      mangas = mangas.map(m => Object.assign({}, m, {image: path.join(img_dir, m.image)}));
      res.render('index', {mangas});
  });
});

app.listen(3000, () => {console.log("Listening on port 3000.");});
