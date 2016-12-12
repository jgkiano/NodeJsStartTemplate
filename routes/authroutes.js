var express = require("express");
var router = express.Router();
var passport = require("passport");
var config = require("../authentication/oauth.js");
var SocialAuth = require("../authentication/strategies.js");

//facebook
router.get('/facebook', passport.authenticate("facebook"), function(req, res){});

router.get('/facebook/callback', passport.authenticate("facebook", { failureRedirect: "/" }), function(req, res) {
    res.redirect('/home');
});

//github
router.get('/github', passport.authenticate("github"), function(req, res){});

router.get('/github/callback', passport.authenticate("github", { failureRedirect: "/" }), function(req, res) {
    res.redirect('/home');
});

//google
router.get("/google", passport.authenticate("google", { scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'
]}), function(req, res){});

router.get('/google/callback', passport.authenticate("google", { failureRedirect: "/" }), function(req, res) {
    res.redirect('/home');
});

module.exports = router;
