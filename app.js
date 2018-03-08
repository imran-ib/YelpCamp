var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var app             = express();
var Campground      = require('./models/campground');
var Comment         = require('./models/comment');
var seedDB          = require('./seeds');
seedDB();

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
        res.render('campground/index' , {campgrounds : campgrounds});
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
app.get('/campgrounds/:id/comments/new' , function (req , res) {
    Campground.findById(req.params.id , function (err , campground) {
       if(err) throw err;
       else {
           res.render('comments/new', {campground : campground})
       }
    });
});

app.post('/campgrounds/:id/comments', function (req , res) {
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
//    Routes
// ========================================

// ========================================
//    Routes
// ========================================

// ========================================
//    Routes
// ========================================




// SERVER
app.listen(3000 , function(req , res){
  console.log("Sever Is Ruing on Port 3000")
});
module.exports = app;
