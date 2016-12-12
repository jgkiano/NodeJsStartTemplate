var passport        = require("passport"),
    config          = require("./oauth.js"),
    FacebookStrategy= require("passport-facebook").Strategy,
    GithubStrategy  = require('passport-github2').Strategy,
    GoogleStrategy  = require('passport-google-oauth2').Strategy,
    User            = require('../models/user.js');

module.exports =

passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
    verifyUser(profile, done)
}));
passport.use(new GithubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
},
function(accessToken, refreshToken, profile, done) {
    verifyUser(profile, done)
}));

passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
},
function(accessToken, refreshToken, profile, done) {
    verifyUser(profile, done)
}));
function verifyUser(profile, done) {
    User.findOne({ oauthID: profile.id }, function(err, user) {
        if(err) {
            console.log(err);  // handle errors!
        }
        if (!err && user !== null) {
            //if there's a user and no errors log them in
            done(null, user);
        } else {
            user = new User({
                oauthID: profile.id,
                oauthProvider: profile.provider,
                name: profile.displayName,
                created: Date.now()
            });
            user.save(function(err) {
                if(err) {
                    console.log(err);  // handle errors!
                } else {
                    console.log("saving user ...");
                    //log newly created user in
                    done(null, user);
                }
            });
        }
    });
}
