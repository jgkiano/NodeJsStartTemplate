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

//requiring routes
var indexRoutes = require("./routes/index"),
    authRoutes = require("./routes/authroutes")

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
var url = process.env.DATABASEURL || "mongodb://localhost/yourdb";
mongoose.connect(url);

app.use("/", indexRoutes);
app.use("/auth", authRoutes);

app.listen(app.get('port'), function() {
  console.log("App is running at localhost:" + app.get('port'))
})
