const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb/lib/fp');
const R = require('ramda');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('.data/db.json');
const slug = require('slug');
const app = express();
app.set('view engine', 'ejs');

low(adapter).then(async (db) => {

  // default post list
  const defaultPosts = {
    'hello-world': {
      summary: 'Hello world!',
      content: 'I would like to sincerely welcome the world.'
    },
  };
  
  const posts = await db('posts', defaultPosts);
  const getPostSlug = (summary) => {
    const postSlug = slug(summary);
    if (!posts.has(postSlug)) {
      return postSlug;
    }
    for (let i = 2;; i++) {
      const numberedPostSlug = `${postSlug}-${i}`;
      if (!posts.has(numberedPostSlug)) {
        return numberedPostSlug;
      }
    }
  };
  
  // setup routing
  app.use(express.static('public'));
  app.get('/', (req, res) => res.render('pages/index', {
    posts: posts(R.identity),
  }));

  app.get('/reset', async (req, res) => {
    await posts.write([
      R.empty,
      R.mergeLeft(defaultPosts),
    ]);
    console.log('reseted posts');
    res.redirect('/');
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.post('/post', async (req, res) => {
    const { summary, content } = req.body;
    const slug = getPostSlug(summary);
    await posts.write([
      R.assoc(slug, {
        summary,
        content,
      })
    ]);
    if (typeof req.query.redirect === 'string') {
      res.redirect('/');
    } else {
      res.sendStatus(200);
    }
  });
  
  // listen for requests :)
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });

});