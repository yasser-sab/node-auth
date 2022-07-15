const jwt = require('jsonwebtoken');

function checkToken(req,res,next){
    const authHeader = req.get('authorization');
    if(authHeader){
        const token = authHeader.split(' ')[1];
        if(token){
            jwt.verify(token,process.env.TOKEN_SECRET,(error,user)=>{
                if(error){
                    console.log("your not authorized");
                    next();
                }else{
                    req.user=user;
                    next();
                }
            });
        }else{
            console.log("your not authorized");
            next();
        }
    }else{
        console.log("your not authorized");
        next();
    }
}

module.exports = {checkToken};