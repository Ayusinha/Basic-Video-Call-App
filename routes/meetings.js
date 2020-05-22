const express = require('express');
const router = express.Router();

// Bring in User Model
let User = require('../models/user');
let Meeting = require('../models/meetings');


// Register Form

router.get('/create/:username', function(req, res){
    let data=req.params.username;
    Meeting.findOne({username:data},(err,res)=>{
        console.log(res.name + " " + res.email + " " + res.username);
        res.send("Hello");
    })
});

module.exports = router;
