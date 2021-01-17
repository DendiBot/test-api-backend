var express = require('express');
var router = express.Router();
var User = require('../models/user');

var tokenService = require('../services/auth');
var passwordService = require('../services/password');

// // a route for registration - POST
// router.post('/register', function(req, res, next){
//   console.log(req.body);
//   res.send("Register Route");
// })
// // a route for login - POST
// router.post('/login', function(req, res, next){
//   console.log(req.body);
//   res.send("Login Route");
// })
// // a route for getting profile info - GET
// router.get('/profile', function(req, res, next){
//   res.send("Profile Route");
// })



router.post('/register', async (req, res, next) => {
  try {
    console.log(req.body);
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: passwordService.hashPassword(req.body.password)
    });
    // console.log(newUser)
    let result = await newUser.save();
    // console.log(result);
    res.json({
      message: "User created successfully",
      status: 200,
    })
  }
  catch (err) {
    console.log(err);
    res.send(err);
    res.json({
      message: "Cannot create user",
      status: 403,
    })
  }
})

// route for login -> /login
router.post('/login', async (req, res, next) => {
  // console.log(req.body);
  await User.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      console.log(err)
      res.json({
        message: "Error Accessing Database",
        status: 500,
      })
    }
    console.log(user);
    if (user) {
      let passwordMatch = passwordService.comparePasswords(req.body.password, user.password);
      if (passwordMatch) {
        let token = tokenService.assignToken(user);
        res.json({
          message: "Login was successful",
          status: 200,
          token
        })
      }
      else {
        console.log("Wrong Password");
        res.json({
          message: "Wrong password",
          status: 403,
        })
      }
    }
    else {
      res.json({
        message: "Wrong username",
        status: 403,
      })
    }
  })

})

// route to get user profile information -> /profile
router.get('/profile', async (req, res, next) => {
  // console.log(req.headers);
  let myToken = req.headers.authorization;
  console.log(myToken);

  if (myToken) {
    let currentUser = await tokenService.verifyToken(myToken);
    console.log(currentUser);

    if (currentUser) {
      let responseUser = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        username: currentUser.username,
        deleted: currentUser.deleted,
        admin: currentUser.admin
      }
      res.json({
        message: "User Profile information loaded successfully",
        status: 200,
        user: responseUser
      })
    }
    else {
      res.json({
        message: "Token was invalid or expired",
        status: 403,
      })
    }
  }
  else {
    res.json({
      message: "No token received",
      status: 403,
    })
  }
})

module.exports = router;
