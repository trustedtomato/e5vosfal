var express = require('express');
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('.data/db.json')
var db = low(adapter)
var app = express();

// default user list
db.defaults({
  posts: [
    {summary: 'Hello world!', text: 'I would like to sincerely welcome the world.'},
  ]
}).write();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/users", function (request, response) {
  var dbUsers=[];
  var users = db.get('users').value() // Find all users in the collection
  users.forEach(function(user) {
    dbUsers.push([user.firstName,user.lastName]); // adds their info to the dbUsers value
  });
  response.send(dbUsers); // sends dbUsers back to the page
});

// creates a new entry in the users collection with the submitted values
app.post("/users", function (request, response) {
  db.get('users')
    .push({ firstName: request.query.fName, lastName: request.query.lName })
    .write()
  console.log("New user inserted in the database");
  response.sendStatus(200);
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