const express = require('express');
const router = express.Router()

router.get('/',(req,res)=>{
    res.json({
        message:'hello yasser !'
    });
});

router.post('/signup',(req,res)=>{
    console.log('body',req.body);
    res.json({
        message:'you are in signup page !'
    });
});

module.exports = router;