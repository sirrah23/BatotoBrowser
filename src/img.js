/**
* Grab the current cover for each manga and store
* it in a directory with a sluggified name.
*/

const fs = require('fs');
const path = require('path');
const slug = require('slug');
const request = require('request');
const cheerio = require('cheerio');

module.exports = function(dir){

  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  function download_cover(manga_name, manga_link){
    return new Promise((resolve, reject) => {
      //TODO: Might need a try/catch here for the connection-refused error
      request(manga_link, function(err, res, body){
        if(err){
          resolve(`Error ${manga_name}: ${err}`);
          return;
        }
        const $ = cheerio.load(body);
        const img_elem = $('div.ipsBox:nth-child(15) > div:nth-child(1) > div:nth-child(1) > img:nth-child(1)');
        const img_link = img_elem.attr('src');
        const ext = img_link.substr(img_link.length-3); //png or jpg
        const fname = `${slug(manga_name)}.${ext}`;
        request(img_elem.attr('src')).pipe(fs.createWriteStream(path.join(dir, fname)));
        resolve({title: manga_name, link: manga_link, image: fname});
      });
    });
  }

  return download_cover;

};
