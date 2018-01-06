//Imports
const fs = require('fs');
const path = require('path');
const pug = require('pug');

//Constants
//TODO: Get rid of this logic from within here
const img_dir = 'images';

//Write manga data to a html page given a template and destination
function mangaHTML(mangas, template, dest){
  mangas = mangas.map(m => Object.assign({}, m, {image: path.join(img_dir, m.image)}));
  const compiledFunction = pug.compileFile(template);
  fs.writeFileSync(dest, compiledFunction({mangas}), 'utf8', (err) => {
    if(err){
      console.log(`Unable to write data to ${dest}`);
    }
    console.log(`Data written to ${dest}`);
  });
}

module.exports = mangaHTML;
