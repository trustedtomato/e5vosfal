const express = require('express');
const bodyParser = require('body-parser');
const R = require('ramda');
const { connect } = require('marpat');
const Post = require('./models/post');

const app = express();
app.set('view engine', 'ejs');

// setup database
connect('nedb://.data/data.json').then(async () => {
  
  // setup routing
  app.use(express.static('public'));
  app.get('/', async (req, res) => res.render('pages/index', {
    posts: await Post.find({}),
  }));
  
  app.get('/reset', async (req, res) => {
    await Post.deleteMany({});
    console.log('reseted posts');
    res.redirect('/');
  });
  
  app.get('/post/:urlSlug', async (req, res) => {
    const post = await Post.findOne({ urlSlug: req.params.urlSlug })
    res.render('pages/post', { post });
  });
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.post('/post', async (req, res) => {
    const { summary, content } = req.body;
    const urlSlug = await Post.getUrlSlug(summary);
    try {
      await Post.create({
        urlSlug,
        summary,
        content,
      }).save();
      if (typeof req.query.redirect === 'string') {
        res.redirect('/');
      } else {
        res.sendStatus(200);
      }
    } catch(err) {
      if (typeof req.query.redirect === 'string') {
        res.redirect('/?error=' + encodeURIComponent(JSON.stringify(err)));
      } else {
        res.status(400);
        res.json(err);
      }
    }
  });
  
  // listen for requests :)
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
});