const express = require('express');
const bodyParser = require('body-parser');
const R = require('ramda');
const { connect } = require('marpat');
const Post = require('./models/post');
const slug = require('slug');

const app = express();
app.set('view engine', 'ejs');

// setup database
connect('nedb://.data/data.json').then((db) => {

  const getPostSlug = (summary) => {
    const postSlug = slug(summary).toLowerCase();
    if (posts([
      R.has(postSlug),
      R.not
    ])) {
      return postSlug;
    }
    for (let i = 2;; i++) {
      const numberedPostSlug = `${postSlug}-${i}`;
      if (posts([
        R.has(numberedPostSlug),
        R.not
      ])) {
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
  
  app.get('/post/:id', async (req, res) => {
    const post = posts(R.prop(String(req.params.id)));
    res.render('pages/post', { post });
  });
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.post('/post', async (req, res) => {
    const { summary, content } = req.body;
    const id = getPostSlug(summary);
    await posts.write([
      R.assoc(id, {
        summary,
        content,
        comments: [],
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