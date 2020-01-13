const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let userModel = require('./../models/userModel');

passport.use(new LocalStrategy({usernameField: 'email'}, (username, password, done)=>{
    userModel.findOne({email: username}, (err, user)=>{
        if(err){
            done(err);
        } else if(!user){
            return done(null, false, {email: 'Email is not registered'});
        } else{
            user.verifyPassword(password, (err, result)=>{
                //console.log(result, err);
                if(err) return done(err);
                if(!result){
                    return done(null, false, {message: 'wrong password'});
                } else{
                    return done(null, user);
                }
            })
        }
    })
}));
