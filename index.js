const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database,{ useUnifiedTopology: true ,useNewUrlParser: true});
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

const app = express();

app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res)=>{
      res.render('login');
});

app.get('/profile',(req,res)=>{
    res.render('profile');
})

// Route Files
let users = require('./routes/users');
app.use('/users', users);

// Start Server
let port=3000;
app.listen(port, ()=>{
  console.log('Server started on port 3000...');
});
