const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', {mangas: [
    //Test Code
    {title: 'Manga A', link:'my-link-1.net', image:'my-img1.jpg'},
    {title: 'Manga B', link:'my-link-2.net', image:'my-img2.jpg'},
  ]});
});

app.listen(3000, () => {console.log("Listening on port 3000.");});
