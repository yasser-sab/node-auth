const express = require('express');
const volleyball = require('volleyball');
const auth = require('./auth/index.js');
const bodyParser = require('body-parser');

const app = express();

app.use(volleyball);
app.use(bodyParser);

// app.get('/',(req,res)=>{
//     res.json({
//         message:'hello world !'
//     });
// });

// auth gonna be prepend by auth
app.use('/auth',auth);

app.listen('5000',()=>{
    console.log('you are logged in yasser!');
});