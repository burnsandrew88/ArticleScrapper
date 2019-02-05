// npm packages
var express = require("express");
var exphbrs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");

//Require all of our models

var db = require("./models");
var Article= require("./models/Article");
var Note= require("./models/Note");

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
//(Don't need to use this render fashion anymore because the app is working to pull in Articles already in the Database)
// app.get("/", function (req, res) {
//     res.render("index");
// });

app.get("/", function(req,res){
    Article.find({"saved": false},function(err,data){
        var hbsObject = {
            Article: data
        };
        console.log(hbsObject);
        res.render("index", hbsObject);
    });
    
});

// render the saved articles
app.get("/saved", function(req, res) {
    Article.find({"saved": true}).populate("notes").exec(function(error, data) {
      var hbsObject = {
        Article: data
      };
      res.render("saved", hbsObject);
    });
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
            results.headline = $(this).children(".listElmnt-blogItem").find("a").text().trim();

            // In the currently selected element, look at its child elements (i.e., its a-tags),
            // then save the values for any "href" attributes that the child elements may have
            results.link = $(this).children().children("a").attr("href");

            results.summary = $(this).children().children("p").text().trim();

            // If statement that checks to see if Article is the DB already 

            // 

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

    res.send("scrape complete");
});

// A GET Route to find the articles from the Mongo DB 
app.get('/articles', function(req,res){
    db.Article.find({"saved" : true}).limit(10)
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // GET Request for grabbing saved Notes from the Mongo DB with its note
  app.get("/saved", function(req, res) {
    Article.find({"saved": true}).populate("note").exec(function(error, data) {
      var hbsObject = {
        Article: data
      };
      res.render("saved", hbsObject);
    });
  });

  // POST Route for creating and Updating Notes

  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
// Save an article
  app.post("/articles/saved/:id", function(req, res) {
    // Use the article id to find and update its saved boolean
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true})
    // Execute the above query
    .exec(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      else {
        // Or send the document to the browser
        res.send(doc);
      }
    });
});












// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
