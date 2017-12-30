/**
* Scrapes your list of followed manga and loads them all
* into a SQL database. It will also download the cover art
* for eacn manga.
*/

const scrape = require('./src/scraper.js');
const cover = require('./src/img.js')('./images');
const db = require('./src/db.js')('./data.db');
const creds = require('./creds.js');

async function scrape_and_load(){
  const manga = await scrape(creds.username, creds.password);
  console.log(`Scraped ${manga.length} manga`);
  await db.insertMany(manga);
  console.log('Manga loaded into database');
  const downloads = manga.map(m => cover(m.title, m.link));
  return Promise.all(downloads);
}

scrape_and_load()
  .then((vals) => {
    vals.forEach((val) => {
      if(val.startsWith("Error:")){
        console.log(val);
      };
    });
    console.log("Manga covers downloaded");
  });
