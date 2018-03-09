var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var passport        = require('passport');
var localStrategy   = require('passport-local');
var methodOverride  = require('method-override');
var app             = express();

var Campground      = require('./models/campground');
var Comment         = require('./models/comment');
var User            = require('./models/user');
var commentRoutes   = require('./routes/comments');
var campgroundRoutes   = require('./routes/campgrounds');
var authRoutes   = require('./routes/index');
var seedDB          = require('./seeds');

//seed the database
//seedDB();


// ========================================
//      Passport Configurations
// ========================================
app.use(require('express-session')({
    secret : "imagination is more important then knowledge",
    resave : false,
    saveUninitialized : false
}));

app.use((passport.initialize()));
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//mongoose connect
mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.Promise = global.Promise;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

//pass currentUser to every single route
app.use(function (req , res, next) {
   res.locals.currentUser = req.user;
   next();
});

// require Routes
app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

// ========================================

app.get('/' , function (req , res ) {
    res.render("landing")
});

// SERVER
app.listen(8080 , function(req , res){
  console.log("Sever Is Ruing on Port 8080")
});
