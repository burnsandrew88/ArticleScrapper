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

// Connect to the Mongo DB (Need more explanation on this)
mongoose.connect();

// Routes










// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  