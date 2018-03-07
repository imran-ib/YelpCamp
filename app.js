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
    image : String
});
var Campground = mongoose.model("Campground" , campgroundSchema);

// Campground.create({
//         name : "fire_flame" ,
//         image : "https://cdn.pixabay.com/photo/2016/11/29/04/17/bonfire-1867275_960_720.jpg"
//
// } , function (err , campground) {
//     if (err) throw err;
//     else{console.log(campground)}
// });
// ========================================
//    Routes
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
        res.render('campgrounds' , {campgrounds : campgrounds});
    });
});

// POST ROUTE

app.post('/campgrounds' , function (req , res) {
   //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var newCampgrpund = { name : name , image : image};
    campgrounds.push(newCampgrpund);
   //redirect
    res.redirect('/campgrounds')
});

// ========================================
//    New Route
// ========================================
app.get('/campgrounds/new' , function (req,res) {
   res.render('new')
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

// ========================================
//    Routes
// ========================================


// SERVER

app.listen(3000 , function(req , res){
  console.log("Sever Is Ruing on Port 3000")
});
module.exports = app;
