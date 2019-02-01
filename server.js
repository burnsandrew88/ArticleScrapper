// npm packages
var express = require("express");
var exphbrs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");

//Require all of our models

var db = require("./models");

var PORT = 3000;

// Initialize Express 

var app = express();

// Configure middleware

//Use morgan logger for logging requests
app.use(logger("dev"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Setting up handlebars to render to main.handlebars
app.engine(
    "handlebars",
    exphbrs({
        defaultLayout:"main"
    })
);

app.set("view engine", "handlebars");

// Connect to the Mongo DB (Need more explanation on this)
// mongoose.connect();

// Routes
app.get("/", function (req, res){
    res.render("index");
});

// A GET Route for scraping my news source- Ask for help with this
app.get("/scrape", function (req, res){
    res.render("scrape");
    // axios.get("http://www.startribune.com/").then(function(response){
    //     var $ = cheerio.load(response.data);

    //     $().each(function(i,element){

    //     })
    // })
})










// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  