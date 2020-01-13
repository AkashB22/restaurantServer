var express = require('express');
var router = express.Router();
let userModel = require('./../models/userModel');
let bcrypt = require('bcryptjs');
let passport = require('passport');
let middleware = require('./../middleware/middleware');
let _ = require('lodash');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next)=>{
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  let newUser = new userModel({
    username,
    email,
    password
  });

  newUser.save((err, user)=>{
    if(err){
      res.json({'error': err});
    } else{
      res.json(user);
    }
  });
});

router.post('/login', (req, res, next)=>{
  passport.authenticate('local', (err, user, info)=>{
    if(err) return res.status(400).json(err);
    else if(user){
      //console.log(user);
      res.status(200).json({"token": user.generateJWT()})
    } else{
      res.status(404).json(info);
    }
  })(req, res);
});

router.get('/userprofile', middleware.verification, (req, res, next)=>{
  userModel.findOne({_id: req._id}, (err, user)=>{
    if(err){
      res.status(404).json({'error': err});
    } else if(!user){
      res.status(500).json({'error': 'No user found for that id'});
    } else{
      //console.log(user)
      res.status(200).json({status: true, user: _.pick(user, ['username', 'email'])});
    }
  })
})

router.put('/update', middleware.verification, (req, res, next)=>{
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let repeatPassword = req.body.repeatPassword;
  if(password == repeatPassword){
    userModel.findOne({_id: req._id}, (err, user)=>{
      if(err){
        res.status(404).json({'error': err});
      } else if(!user){
        res.status(500).json({'error': 'No user found for that id'});
      } else{
        let updateUser = {
          email : email != undefined && email.length > 0 ? email : user.email,
          username : username != undefined && username.length > 0 ? username : user.username,
        }
        if(password != undefined && password.length > 0 && !(password.indexOf('*****') > -1)){
          bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(password, salt, (err, hash)=>{
              if(err) console.log(err);
              else{
                updateUser.password = hash;
                updateUser.secretSalt = salt;
                userModel.findByIdAndUpdate(req._id, updateUser,(err, updatedUser)=>{
                  if(err) res.status(500).json({'error': 'error while deleting old user for updation'});
                  else{
                    //console.log(updateUser);
                    res.status(200).json({update: true, user: _.pick(updatedUser, ['username', 'email'])});
                  }
                });
              }
            }) 
          })
        } else{
          userModel.findByIdAndUpdate(req._id, updateUser,(err, updatedUser)=>{
            if(err) res.status(500).json({'error': 'error while deleting old user for updation'});
            else{
              //console.log(updateUser);
              res.status(200).json({update: true, user: _.pick(updatedUser, ['username', 'email'])});
            }
          });
        }
      }
    })
  }
})

router.delete('/delete', middleware.verification, (req, res, next)=>{
  userModel.deleteOne({_id : req._id}, (err, deletedUser)=>{
    if(err) res.status(500).json(err);
    else res.status(200).json({delete: true, user: _.pick(deletedUser, ['username', 'email'])});
  })
});
module.exports = router;
