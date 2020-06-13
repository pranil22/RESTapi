var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');

var User = require('../models/users');
var auth = require('../authenticate');
const cors = require('./cors');

router.use(bodyParser.json());
/* GET users listing. */


router.get('/',cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, function(req, res, next) {
  User.find({})
    .then((dishes) => {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(dishes);
    })
});

router.post('/signup',cors.corsWithOptions, (req, res, next) => {
  User.register(new User({ username: req.body.username }), 
    req.body.password,
    (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({ err: err });
      }
      else {
        if(req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
          user.lastname = req.body.lastname
        }
        user.save((err, user) => {
          if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type','application/json');
            res.json({ err: err });
            return
          }
          passport.authenticate('local')(req, res ,() => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({
              success: true,
              status: 'Registration successful'
            });
          })
        })
      }
    }
  )
});

router.post('/login',cors.corsWithOptions, passport.authenticate('local') ,(req, res, next) => {
    // Authentication sucessful
    console.log("Post req to users/login");
    res.statusCode = 200;
    var token = auth.getToken({ _id: req.user._id });
    console.log(token);
    res.setHeader('Content-Type','application/json');
    res.json({
      success: true,
      token: token,
      status: 'Successfully logged in'
    });
})

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (req.user) {
    console.log(req.user);
    req.session.destroy();
    res.clearCookie('session-id');
    res.json({ success: true, status: 'Logged out successfully' });
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/facebook/token', 
  passport.authenticate('facebook-token'), 
  (req, res, next) => {
    if(req.user) {
      let token = auth.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        token: token,
        status: 'Successfully logged in'
      });
    } 
  }
)


module.exports = router;
