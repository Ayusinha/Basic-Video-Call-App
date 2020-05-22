const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

let newUser = new User({
  name:name,
  email:email,
  username:username,
  password:password
});

bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
    if(err){
        console.log(err);
    }
    newUser.password = hash;
    newUser.save(function(err){
        if(err){
        console.log(err);
        return;
        } else {
        req.flash('success','You are now registered and can log in');
        res.redirect('/users/login');
        }
    });
    });
});
  
});

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

// Login Process
router.post('/login', function(req, res, next){
  console.log(req.body.username);
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/users/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.render('../template/profile.ejs',{data:req.body.username});
    });
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
