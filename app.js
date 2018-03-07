var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser       = require('body-parser');
var mongoose        = require('mongoose');

var app = express();

//mongoose connect
mongoose.connect("mongodb://localhost/yelp_camp");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// ========================================
//      Schema
// ========================================
var campgroundSchema = new mongoose.Schema({
    name : String,
    image : String,
    description : String,
    created :Date
});
var Campground = mongoose.model("Campground" , campgroundSchema);

// Campground.create({
//         name : "fire_flame" ,
//         image : "https://cdn.pixabay.com/photo/2016/11/29/04/17/bonfire-1867275_960_720.jpg",
//     description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam aliquid autem commodi, corporis cupiditate ducimus fugiat ipsam itaque iusto magni perspiciatis placeat quaerat quod rerum ullam veniam vitae, voluptate!"
//
// } , function (err , campground) {
//     if (err) throw err;
//     else{console.log(campground)}
// });
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
        res.render('index' , {campgrounds : campgrounds});
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
   res.render('new')
});

// ========================================
//   SHOW Route
// ========================================
app.get('/campgrounds/:id' , function (req ,res) {
    Campground.findById(req.params.id , function (err , foundCamp) {
    if (err) throw err;
    else {
        res.render('show' , {campground : foundCamp});
    }
    });
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

// ========================================
//    Routes
// ========================================


// SERVER

app.listen(3000 , function(req , res){
  console.log("Sever Is Ruing on Port 3000")
});
module.exports = app;
