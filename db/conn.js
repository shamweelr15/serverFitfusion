const mongoose = require('mongoose');
require('dotenv').config();

const DB= process.env.PORT ||5000;
const API =process.env.DATABASE_API;
const ACTIVITY =process.env.DATABASE_ACTIVITY;
mongoose.connect(DB).then(()=>{
    console.log('connection successfull!')
}).catch((err)=>{
    console.log('no connection!',err)
});





mongoose.createConnection(API);

mongoose.createConnection(ACTIVITY);

module.exports = mongoose;
