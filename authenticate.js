var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users'); 
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');
const FacebookStrategy = require('passport-facebook-token');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
}

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
};

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts, 
        (jwt_payload, done) => { //here _id is supplied when creating a token in users.js
            User.findOne({ _id: jwt_payload._id }, (err, user) => {
                if(err) {
                    done(err, false);
                }
                else if(user) {
                    done(null, user);
                }
                else {
                    done(null, false);
                }
            })
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', { session: false });
exports.verifyAdmin = (req, res, next) => {
    if(req.user != null) {
        if(req.user.admin) {
            next();
        }
        else {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
    }
    else {
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
}

exports.passportFacebook = passport.use(new FacebookStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookId: profile.id }, (err, user) => {
        if(err) {
            done(err,false);
        }
        else if(!err && user !== null) {
            console.log(`Access token ${ accessToken }`);
            console.log(`Refresh token ${ refreshToken }`);
            done(null, user);
        }
        else {
            console.log(`Access token ${ accessToken }`);
            console.log(`Refresh token ${ refreshToken }`);
            user = new User({ username: profile.displayName });
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.facebookId = profile.id;
            user.save((err, user) => {
                if(err) {
                    return done(err, false);
                }
                else {
                    return done(null, user);
                }
            });
        }
    })
}));

