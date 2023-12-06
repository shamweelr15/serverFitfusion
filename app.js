const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
var bodyParser = require('body-parser')
const app = express();

dotenv.config({path : './config.env'})

const mongoose = require('mongoose');


app.use(express.json());
const PORT = process.env.PORT ||5000;

app.use(session({
    secret: 'FTSCS',
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.json());




app.use(require('./router/auth'));

const middleware =(req,res,next)=>{
console.log('this is a middleware');
next();
}

// app.get('/', (req,res)=>{
//     res.send('Home Page app.js');
// })
app.get('/signup', (req,res)=>{
    res.send('Signup Page');
})
app.get('/signin', (req,res)=>{
    res.send('Signin Page');
})
// app.get('/dashboard',middleware, (req,res)=>{
//     res.send('Dashboard Page');
  
// })
app.get('/bmi', (req,res)=>{
    res.send('BMI Page');
})
app.get('/nutrition', (req,res)=>{
    res.send('Nutrition Page');
})
app.get('/activity', (req,res)=>{
    res.send('Activity Page');
})
app.listen(PORT, ()=>{
    console.log(`now server is running at port no. ${PORT}`)
})



