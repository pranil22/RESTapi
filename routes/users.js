var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');

var User = require('../models/users');

router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }), 
    req.body.password,
    (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({ err: err });
      }
      else {
        passport.authenticate('local')(req, res ,() => {
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({
            success: true,
            status: 'Registration successful'
          });
        })
      }
    }
  )
});

router.post('/login',passport.authenticate('local') ,(req, res, next) => {
    // Authentication sucessful
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({
      success: true,
      status: 'Successfully logged in'
    });
})

router.get('/logout', (req, res, next) => {
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


module.exports = router;
