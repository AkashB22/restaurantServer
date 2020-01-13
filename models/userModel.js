let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let Schema = mongoose.Schema;
let UserSchema = new Schema({
    username: { 
        type:String, 
        required: "username can\'t be empty" 
    },
    email : {
        type : String,
        unique: true
    },
    password: { 
        type:String,
        required: "password can\'t be empty",
        minlength: [4, "Password must be atleast 4 characters long"]
    },
    latitude : Number,
    longitude: Number,
    secretSalt: { 
        type:String
    }
});

UserSchema.pre('save', function(next){
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(this.password, salt, (err, hash)=>{
            this.password = hash;
            this.secretSalt = salt;
            next();
        });
    });
});

UserSchema.path('email').validate((val)=>{
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(val);
}, 'Invalid email');

UserSchema.methods.verifyPassword = function(password, cb){
    bcrypt.compare(password, this.password, cb);
}

UserSchema.methods.generateJWT = function(){
    return jwt.sign({id: this._id},
    process.env.JWTSECRET, 
    {expiresIn: process.env.JWTEXP});
}

module.exports = mongoose.model('user', UserSchema);