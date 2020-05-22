const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const { v1: uuidv1 } = require('uuid');
// console.log(uuidv1()); 

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

// Bring in User Model and Meeting Model
let User = require('./models/user');
let Meeting = require('./models/meetings');
var MongoClient = require('mongodb').MongoClient;

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

app.get('/profile/:username',(req,res)=>{
  let username= req.params.username;
    res.render(__dirname+'/template/profile.ejs',{data:username});
    
})

app.get('/create/:username',(req,ress)=>{
  let username= req.params.username;
  let meeting_id,host_name,host_email;
  User.findOne({username:username},(err,res)=>{
    //console.log(res.name + " " + res.email + " " + res.username);
    meeting_id=uuidv1();
    host_name=res.name;
    host_email=res.email;
    console.log(host_email+"  .. ..  "+host_name+" .. ..  " +meeting_id);
    let newMeeting=new Meeting({
      host_name:host_name,
      host_email:host_email,
      meeting_id:meeting_id
    });
    newMeeting.save( err=>{
      if(err){
        console.log(err);
        return;
        } else {
        console.log('Meeting data is Recorded');
        }
    });
    MongoClient.connect(config.db, (err, db) => {
      if (err) throw err;
      var dbo = db.db("new-app");
      dbo.createCollection(meeting_id, function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
      });
      let hostData={
            username:username,
            email: host_email,
            joining_time: new Date(),
            host: true
          }
      dbo.collection(meeting_id).insertOne(hostData, function(err, res) {
            if (err) throw err;
            console.log("Host Details has been inserted");

            //link to the video call
            ress.send("Hello Create DB-Done!")

            db.close();
          });
    });
  })
  // console.log(host_email+"  .. ..  "+host_name+" .. ..  " +meeting_id);
})

app.post('/join/:username',(req,ress)=>{
   let meeting_id=req.body.meeting_id;
   let username=req.params.username;
   console.log(meeting_id+ "  .. ..  "+username);
   User.findOne({username:username},(err,res)=>{
      let email=res.email;
      MongoClient.connect(config.db, (err, db) => {
        if (err) throw err;
        var dbo = db.db("new-app");
        let userData={
              username:username,
              email: email,
              joining_time: new Date(),
              host: false
        }
        dbo.collection(meeting_id).insertOne(userData, function(err, res) {
              if (err) throw err;
              console.log("User Details has been inserted");

              //link to the video call
              ress.send("Hello Join DB-Done!");

              db.close();
            });
      });
   });
})


// Route Files
let users = require('./routes/users');
app.use('/users', users);
let meetings = require('./routes/meetings');
app.use('/meetings',meetings);


// Start Server
let port=3000;
app.listen(port, ()=>{
  console.log('Server started on port 3000...');
})