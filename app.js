var express         = require ("express")
    app             = express(),
    bodyParser      = require ("body-parser"),
    mongoose        = require ("mongoose"),
    flash           = require("connect-flash"),
    User            = require("./models/user.js");
    passport        = require("passport"),
    config          = require("./authentication/oauth.js"),
    SocialAuth      = require("./authentication/strategies.js"),
    methodOverride  = require("method-override")

//set port
app.set('port', (process.env.PORT || 3000));

// serialize and deserialize
passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user._id);
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        console.log('deserializeUser: ' + user._id);
        if(!err) done(null, user);
        else done(err, null);
    });
});

//setup bodyParser
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//public dir
app.use(express.static(__dirname + "/public"));

//methodOverride for RESTful Routing
app.use(methodOverride("_method"));

//setup flash
app.use(flash());

//set up express session
app.use(require("express-session")({
    secret: "Boom shaka shaka boom",
    resave: false,
    saveUninitialized: false
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//if you're seeding a db do it here

//res.user, success and error passed on every sigle route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
});

//-----Mongoose-----//
// connect to the database
var url = process.env.DATABASEURL || "mongodb://localhost/demoapp";
mongoose.connect(url);

//-----ROUTES------//

app.get("/", function(req, res) {
    if(req.isAuthenticated()) {
        res.render("home");
    } else {
        res.render("landing");
    }
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/home", ensureAuthenticated, function(req, res) {
    res.render("home")
});

//-----AUTHENTICATION ROUTES---//

//facebook
app.get('/auth/facebook', passport.authenticate("facebook"), function(req, res){});

app.get('/auth/facebook/callback', passport.authenticate("facebook", { failureRedirect: "/" }), function(req, res) {
    res.redirect('/home');
});

//github
app.get('/auth/github', passport.authenticate("github"), function(req, res){});

app.get('/auth/github/callback', passport.authenticate("github", { failureRedirect: "/" }), function(req, res) {
    res.redirect('/home');
});

//google
app.get("/auth/google", passport.authenticate("google", { scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'
]}), function(req, res){});

app.get('/auth/google/callback', passport.authenticate("google", { failureRedirect: "/" }), function(req, res) {
    res.redirect('/home');
});

//logout
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect('/');
});

//MiddleWare - test authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(app.get('port'), function() {
  console.log("App is running at localhost:" + app.get('port'))
})
