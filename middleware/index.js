var passport = require("passport");

var middlewareObj = {};

//MiddleWare - test authentication
middlewareObj.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = middlewareObj;
