/**
* Scrapes your list of followed manga and loads them all
* into a SQL database. It will also download the cover art
* for each manga.
*/

const scrape = require('./src/scraper.js');
const cover = require('./src/img.js')('./public/images');
const db = require('./src/db.js')('./data.db');
const pc = require('./src/page_compiler.js');
const creds = require('./creds.js');

async function scrape_and_load(){
  let manga = await scrape(creds.username, creds.password);
  console.log(`Scraped ${manga.length} manga from manga list`);
  const titles = await db.readAllTitle();
  manga = manga.filter((m) => titles.indexOf(m.title) === -1);
  if(manga.length === 0){
    console.log("No new manga was discovered");
    return Promise.resolve("No new manga to load");
  } else {
    console.log(`${manga.length} new manga discovered`);
  }
  const downloads = manga.map(m => cover(m.title, m.link));
  console.log("Scraping images for new manga");
  const manga_with_image = await Promise.all(downloads);
  const to_insert = [];
  manga_with_image.forEach((val) => {
    if (typeof val === "string"){
      console.log(val);
    } else {
      to_insert.push(val);
    }
  });
  await db.insertMany(to_insert);
  console.log('Manga loaded into database');
  return Promise.resolve(`${to_insert.length} new manga loaded`);
}

scrape_and_load()
  .then((val) => {
    console.log(val);
    return db.readAllData();
  })
  .then(mangas => {
    pc(mangas, './template/index.pug', './views/index.html');
  })
  .catch((e) => {
    console.log(e);
  });

