const express = require('express');
const low = require('lowdb/lib/fp');
const R = require('ramda');
const FileAsync = require('lowdb/adapters/FileAsync')
const adapter = new FileAsync('.data/db.json')
const db = low(adapter)
const app = express();
app.set('view engine', 'ejs');

// default post list
const defaultPosts = [
  {
    summary: 'Hello world!',
    text: 'I would like to sincerely welcome the world.'
  },
];

const posts = db('posts', defaultPosts);

// setup routing
app.use(express.static('public'));
app.get('/', (req, res) => res.render('pages/index', {
  posts: posts(),
}));

app.get('/reset', (req, res) => {
  R.empty(posts)
  db.get('posts')
    .remove()
    .write();
});

// removes entries from users and populates it with default users
app.get("/reset", function (request, response) {
  // removes all entries from the collection
  db.get('users')
  .remove()
  .write()
  console.log("Database cleared");
  
  // default users inserted in the database
  var users= [
      {"firstName":"John", "lastName":"Hancock"},
      {"firstName":"Liz",  "lastName":"Smith"},
      {"firstName":"Ahmed","lastName":"Khan"}
  ];
  
  users.forEach(function(user){
    db.get('users')
      .push({ firstName: user.firstName, lastName: user.lastName })
      .write()
  });
  console.log("Default users added");
  response.redirect("/");
});

// removes all entries from the collection
app.get("/clear", function (request, response) {
  // removes all entries from the collection
  db.get('users')
  .remove()
  .write()
  console.log("Database cleared");
  response.redirect("/");
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});