/**
* Creates a sqlite database & a manga table and provides
* functions to allow you to load manga into said table.
*/


module.exports = function(dbname){

  const knex = require('knex')({
    dialect: 'sqlite3',
    connection:{
      filename: dbname
    }
  });

  knex.schema.createTableIfNotExists('manga', function(table){
    table.increments('id');
    table.string('title');
    table.string('link');
    table.string('image');
  })
    .then()
    .catch((e) => {
      console.log(e);
    });

  return {

    //Inserts an object with title & link properties
    insertOne: (manga) => {
      return knex('manga').insert(manga);
    },

    //Inserts a list of objects with title & link properties
    insertMany: (manga) => {
      return knex('manga').insert(manga);
    },

    //Read the entire list of manga titles in the manga table
    readAllTitle: () => {
      return knex
        .select('title')
        .from('manga')
        .then(vals => {
          return vals.map(val => val.title);
        });
    }

  };

};
