const express = require('express');
const joi = require('joi');
const db = require('../db/connection.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


const users = db.get('users');

const router = express.Router()

// for fast querying database
// users.index('username');
users.createIndex('username',{unique:true});

const schema =  joi.object().keys({
    username:joi.string().regex(/^[a-zA-Z0-9_]+$/).min(3).max(30).required(),
    password:joi.string().min(6).trim().required()
});


function createToken(user,res,next){
    const payload={
        _id:user._id,
        username:user.username
    };
    jwt.sign(payload,process.env.TOKEN_SECRET,{
        expiresIn:"1d"
    },(err,token)=>{
        if(err){
            res.status(400);
            const error=new Error("username or password invalid !!");
            next(error);
        }else{
            res.json({
                token:token
            });
        }

    });
}

function sendBackError(statusCode,message,res,next){
    res.status(statusCode);
    const error=new Error(message);
    next(error);
}

router.post('/signup',(req,res,next)=>{
    const result = schema.validate(req.body);
    if(result.error==null){
        users.findOne({
            username:req.body.username
        }).then((user)=>{
            if(user){
                sendBackError(409,'user already exist !!',res,next);
            }else{
                bcrypt.hash(req.body.password,12).then(hashed=>{
                    const newUser = {
                        username:req.body.username,
                        password:hashed
                    };
                    users.insert(newUser).then(inserted=>{
                        createToken(inserted,res,next);
                    });
                });
            }
        });
    }else{
        sendBackError(406,'error !!',res,next);
    }
});

router.post('/login',(req,res,next)=>{
    const result = schema.validate(req.body);
    if(result.error==null){
        users.findOne({
            username:req.body.username
        }).then(user=>{
            if(user){
                bcrypt.compare(req.body.password,user.password).then(result=>{
                    if(result){
                        createToken(user,res,next);
                    }else{
                        sendBackError(400,"username or password invalid !!",res,next);
                    }
                });
            }else{
                sendBackError(400,"username or password invalid !!",res,next);
            }
        });
    }else{
        sendBackError(400,"username or password invalid !!",res,next);
    }

});

module.exports = router;