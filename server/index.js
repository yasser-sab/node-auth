const express = require('express');
const volleyball = require('volleyball');
require('dotenv').config();
// if the file inside directory called index then you can just called the dirrectory that contain it
// const auth = require('./auth/index.js');
const auth = require('./auth');
const cors = require('cors');

const app = express();

app.use(volleyball);

// build in body parser
app.use(express.json())

app.use(cors({
    origin:'http://localhost:8080'
}));

app.get('/',(req,res)=>{
    res.json({
        message:'hello world !'
    });
});

// auth gonna be prepend by auth
app.use('/auth',auth);

function notFound(req,res,next){
    res.status(404);
    const error=new Error('not found'+req.originalUrl);
    next(error);
}

function errorHandler(err,req,res,next){
    res.status(res.statusCode||500);
    res.json({
        message:err.message,
        stack:err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

app.listen('5000',()=>{
    console.log('we are listning');
});