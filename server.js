var express = require('express');
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('.data/db.json')
var db = low(adapter)
var app = express();
app.set('view engine', 'ejs');

// default post list
const defaultPosts = [
  {
    summary: 'Hello world!',
    text: 'I would like to sincerely welcome the world.'
  },
];

db.defaults(defaultPosts).write();

// setup routing
app.use(express.static('public'));
app.get('/', (req, res) => res.render('pages/index', {
  posts: db.get('posts').value(),
}));

app.get('/reset', (req, res) => {
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