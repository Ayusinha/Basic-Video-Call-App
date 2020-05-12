//Created by :- Ayush Sinha
//On :- 7-may-2020 @ 16:42 PM
const express=require('express');
const bodyParser= require('body-parser') 
const mongoose=require('mongoose')
const app = express()
app.use(bodyParser.urlencoded({extended: true}))
const {User}= require(__dirname+'/models/user');

//Index directory
app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/template/login.html')
})

//signup
app.get('/signup', (req, res) => {
    res.sendFile(__dirname+'/template/signup.html')
})


app.post('/signup', (req, res) => {
    //console.log('Hello');
    let name = req.body.name; 
    let email =req.body.email; 
    let password = req.body.password; 
    let phone =req.body.phone;  

    User.create({
        name: name, 
        email:email, 
        password:password, 
        phone:phone 
    },(err,result)=>{
         err ? console.log(err) : res.render(__dirname+'/template/profile.ejs',{data: result});
    })
})

//login
app.post('/login',(req, res) =>{
    let email=req.body.email;
    let password=req.body.password;

    User.findOne({email: email}, (err,result) =>{
        if(err) res.send(res.send(`<p>Email not registered or incorrrectly entered !!!</p><br>
                                   <a href="/">Go back to login page</a> OR <a href="/signup">Signup here</a>`))
        else{
            console.log(password + " " + result.password);
            if(password === result.password){
                res.render(__dirname+'/template/profile.ejs',{data: result});
            }else{
                res.send("Incorrect Password Entered !");
            }
        }
    })
})

//creating server
const port=3000;
  app.listen(port, () => {
     console.log( `Running on port number ${port}..`);
})