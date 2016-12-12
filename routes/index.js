var express = require("express");
var router = express.Router();
var passport = require("passport");
var middleware = require("../middleware");

router.get("/", function(req, res) {
    if(req.isAuthenticated()) {
        res.render("home");
    } else {
        res.render("landing");
    }
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.get("/home", middleware.ensureAuthenticated, function(req, res) {
    res.render("home")
});

//logout
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
