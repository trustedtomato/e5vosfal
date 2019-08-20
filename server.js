require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');
const Vote = require('./models/vote');

const app = express();
app.set('view engine', 'ejs');

// setup database
mongoose.connect(
  `mongodb+srv://${encodeURIComponent(process.env.MONGODB_USERNAME)}:${encodeURIComponent(process.env.MONGODB_PASS)}@cluster0-iizuz.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true },
).then(async () => {
  console.log('Connected to database!');
  // setup routing
  app.use(express.static('public'));
  app.get('/', async (req, res) => {
    return res.render('pages/index', {
      posts: await Post.find({}).populate('votes').populate('comments'),
    });
  });

  app.get('/reset', async (req, res) => {
    await Post.deleteMany({});
    console.log('reseted posts');
    res.redirect('/');
  });

  app.get('/post/:urlSlug', async (req, res) => {
    const post = await Post.findOne({ urlSlug: req.params.urlSlug });
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
      });
      if (typeof req.query.redirect === 'string') {
        res.redirect('/');
      } else {
        res.sendStatus(200);
      }
    } catch (err) {
      const error = {
        name: err.name,
        message: err.message,
      };
      if (typeof req.query.redirect === 'string') {
        res.redirect('/?error=' + encodeURIComponent(JSON.stringify(error)));
      } else {
        res.status(400);
        res.json(error);
      }
    }
  });

  app.post('/rate-post', async (req, res) => {
    const { id, rating, redirect } = req.query;
    // TODO: handle errors
    const vote = await Vote.create({
      value: rating,
    });
    await Post.updateOne({ _id: id }, {
      $push: {
        votes: vote,
      },
    });
    if (typeof redirect === 'string') {
      const redirectTo = !redirect ? '/' : redirect;
      res.redirect(redirectTo);
    } else {
      res.sendStatus(200);
    }
  });

  // listen for requests :)
  const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
  });
});
