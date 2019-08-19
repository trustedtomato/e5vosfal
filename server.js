const express = require('express');
const low = require('lowdb/lib/fp');
const R = require('ramda');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('.data/db.json');
const app = express();
app.set('view engine', 'ejs');

low(adapter).then(async (db) => {

  // default post list
  const defaultPosts = [
    {
      summary: 'Hello world!',
      text: 'I would like to sincerely welcome the world.'
    },
  ];
  
  const posts = await db('posts', defaultPosts);
  
  // setup routing
  app.use(express.static('public'));
  app.get('/', (req, res) => res.render('pages/index', {
    posts: posts(R.identity),
  }));

  app.get('/reset', async (req, res) => {
    await posts.write([
      R.empty,
      R.concat(defaultPosts),
    ]);
    console.log('reseted posts');
    res.redirect('/');
  });
  
  // listen for requests :)
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });

});