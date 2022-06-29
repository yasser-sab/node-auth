const express = require('express');
const joi = require('joi');
const db = require('../db/connection.js');
const bcrypt=require('bcryptjs');


const users = db.get('users');

const router = express.Router()

// for fast querying database
// users.index('username');
users.createIndex('username',{unique:true});

const schema =  joi.object().keys({
    username:joi.string().regex(/^[a-zA-Z0-9_]+$/).min(3).max(30).required(),
    password:joi.string().min(6).trim().required()
});

router.get('/',(req,res)=>{
    res.json({
        message:'hello yasser !'
    });
});

router.post('/signup',(req,res,next)=>{
    const result = schema.validate(req.body);
    if(result.error==null){
        users.findOne({
            username:req.body.username
        }).then((user)=>{
            if(user){
                const error=new Error('user already exist !!');
                next(error);
            }else{
                bcrypt.hash(req.body.password,12).then(hashed=>{
                    const newUser = {
                        username:req.body.username,
                        password:hashed
                    };
                    users.insert(newUser).then(inserted=>{
                        delete inserted.password;
                        res.json(inserted);
                    });
                });
            }
        });
    }else{
        next(res.error);
        // res.json({
        //     result
        // });
    }
});

module.exports = router;