let jwt = require('jsonwebtoken');
module.exports.verification = (req, res, next)=>{
    if('authorization' in req.headers){
        let token = req.headers['authorization'].split(' ')[1];
        if(token){
            jwt.verify(token, process.env.JWTSECRET, (err, decoded)=>{
                if(err) res.status(500).json({auth: false, msg: 'token authentication failed'});
                else{
                    //console.log(decoded);
                    req._id = decoded.id;
                    //console.log(req._id);
                    req.expiresIn = decoded.expiresIn;
                    next();
                }
            });

        } else{
            res.status(403).json({auth: false, msg: 'No token provided'});
        }
    }
}