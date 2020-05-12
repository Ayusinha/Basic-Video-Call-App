const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/new-app",{ useNewUrlParser: true,useUnifiedTopology: true });
const db=mongoose.connection;  
db.once('open', function(callback){ 
    // console.log(db.collections.find())
    console.log("connection succeeded"); 
})
const User = mongoose.model('user', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    phone: {
        type: String,
        required: [true, 'User phone number required']
      }
}));

exports.User = User;