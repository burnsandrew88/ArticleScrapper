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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Setting up handlebars to render to main.handlebars
app.engine(
    "handlebars",
    exphbrs({
        defaultLayout: "main"
    })
);

app.set("view engine", "handlebars");

// Connect to the Mongo DB (Need more explanation on this)
mongoose.connect("mongodb://localhost/ArticleScraper", { useNewUrlParser: true });
// mongoose.connect();

// Routes
app.get("/", function (req, res) {
    res.render("index");
});

// A GET Route for scraping my news source- Ask for help with this
app.get("/scrape", function (req, res) {
    axios.get("https://www.ign.com/articles?tags=news").then(function (response) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);

        // An empty array to save the data that we'll scrape
        var results = {};

        // With cheerio, find each a-tag with the "title" class
        // (i: iterator. element: the current element)
        $(".listElmnt").each(function (i, element) {

            // Save the text of the element in a "title" variable
            results.headline = $(this).children(".listElmnt-blogItem").find("a").text();

            // In the currently selected element, look at its child elements (i.e., its a-tags),
            // then save the values for any "href" attributes that the child elements may have
            results.link = $(this).children().children("a").attr("href");

            results.summary = $(this).children().children("p").text();

            // create a new article using the 'result' object built from scraping
            db.Article.create(results)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        
    });

    res.send("scrape complete")
});

// A GET Route to find the articles from the Mongo DB 
app.get("/articles", function(req,res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

// A GET Route to rendering and showing my saved articles collections from Mongo DB with HBRs
app.get("/saved", function (req, res) {
    res.render("saved");
})










// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
