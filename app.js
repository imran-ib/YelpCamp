var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var passport        = require('passport');
var localStrategy   = require('passport-local');
var app             = express();
var Campground      = require('./models/campground');
var Comment         = require('./models/comment');
var User            = require('./models/user')
var seedDB          = require('./seeds');
seedDB();
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
//pass currentUser to every single route
app.use(function (req , res, next) {
   res.locals.currentUser = req.user;
   next();
});
// ========================================
//      Schema
// ========================================

// ========================================
//   Index Routes
// ========================================

app.get('/' , function (req , res ) {
    res.render("landing")
});

// ========================================
//    Camp Grounds Routes
// ========================================
app.get('/campgrounds' , function (req,res) {
    // Get All Campground from DB
    Campground.find({} , function (err , campgrounds) {
       if (err) throw err;
        res.render('campground/index' , {campgrounds : campgrounds , currentUser : req.user});
    });
});

// POST ROUTE

app.post('/campgrounds' , function (req , res) {
   //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var des = req.body.description;
    var newCampground = { name : name , image : image , description: des};
    Campground.create(newCampground , function (err , newlyCreated) {
       if(err) throw err;
       else{
           res.redirect('/campgrounds')
       }
    });
});

// ========================================
//    New Route
// ========================================
app.get('/campgrounds/new' , function (req,res) {
   res.render('campground/new')
});

// ========================================
//   SHOW Route
// ========================================
app.get('/campgrounds/:id' , function (req ,res) {
    Campground.findById(req.params.id).populate("comments").exec( function (err , foundCamp) {
    if (err) throw err;
    else {
        res.render('campground/show' , {campground : foundCamp});
    }
    });
});
// ========================================
//   Comments Routes
// ========================================
app.get('/campgrounds/:id/comments/new' , isLoggedIn , function (req , res) {
    Campground.findById(req.params.id , function (err , campground) {
       if(err) throw err;
       else {
           res.render('comments/new', {campground : campground})
       }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn , function (req , res) {
    Campground.findById(req.params.id , function (err , campground) {
           if (err) {
               console.log(err);
               res.redirect("/campgrounds")
           }
           else{
               Comment.create(req.body.comment , function (err , comment) {
                  if (err) throw err;
                  else {
                      campground.comments.push(comment);
                      campground.save();
                      res.redirect('/campgrounds/' + campground._id);
                  }
               });
           }
       })
 });
// ========================================
//    Auth Routes
// ========================================
    // Register Form

app.get('/register' , function (req  , res) {
   res.render('register')
});
app.post('/register' , function (req , res) {
    var newUser = new User({username : req.body.username});
    User.register(newUser , req.body.password , function (err , user) {
        if(err) {
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req , res , function () {
           res.redirect('/campgrounds')
        });
    })
});
        // Log in
app.get('/login' , function (req, res) {
   res.render('login')
});

app.post('/login' ,passport.authenticate("local",
    {successRedirect : "/campgrounds",
        failureRedirect: '/login'
    }) ,function (req , res) {

});

    //logout
app.get('/logout' , function (req , res) {
    req.logout();
    res.redirect('/campgrounds')
});


// Is LogIn

function isLoggedIn(req, res, next) {
 if (req.isAuthenticated()){
     return next();
 }
    res.redirect('/login')
}
// ========================================
//    Routes
// ========================================

// ========================================
//    Routes
// ========================================




// SERVER
app.listen(8080 , function(req , res){
  console.log("Sever Is Ruing on Port 8080")
});
module.exports = app;
