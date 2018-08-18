var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var localStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./models/user');

mongoose.connect("mongodb://bunny:qwerty12345@ds123822.mlab.com:23822/auth-passport", function(){
  console.log("Connneted to the database");
});

var app = express();
var port = 5000 || process.env.PORT;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
  secret: "Node is the best",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes

app.get('/', function(req, res){
  res.render('home');
});

app.get('/secret', isLoggedIn, function(req, res){
  res.render("secret");
});

app.get('/register', function(req, res){
  res.render("register");
});
app.post('/register', function(req, res){
  req.body.username
  req.body.password
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render('register');
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secret");
    })
  })
});

app.get('/login',function(req, res){
  res.render()
});

app.post('login', passport.authenticate("local", {
  successRedirect: '/secret',
  failureRedirect: '/login'
}),function(req, res){
});

app.get('/logout', function(req, res){
  req.logut();
  res.redirect("/");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated(){
    return next();
  });
  res.redirect("/login");
}

app.listen(port, function() {
  console.log("Auth Server has started");
})
