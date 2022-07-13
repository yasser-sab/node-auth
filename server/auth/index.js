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
                res.status(409);
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
        res.status(406);
        next(res.error);
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
                    }else{
                        res.status(400);
                        const error=new Error("username or password invalid !!");
                        next(error);
                    }
                });
            }else{
                res.status(400);
                const error=new Error("username or password invalid !!");
                next(error);
            }
        });
    }else{
        res.status(400);
        const error=new Error("username or password invalid !!");
        next(error);
    }

});

module.exports = router;