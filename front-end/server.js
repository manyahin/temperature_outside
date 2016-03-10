// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var fs = require('fs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// Mongo Setup
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 
// Connection URL 
var url = 'mongodb://localhost:27017/metrics';

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.get('/display', function(req, res) {
  fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    // Get the documents collection
    var collection = db.collection('temperature_by_hour');

    collection.find().sort({'_id': -1}).nextObject(function(err, item) {
      res.json({message: 'current temperature is ' + item.value });
    });

  });

//    res.json({ message: 'hooray! welcome to our api!' });   
});

router.get('/last', function(req, res) {
  // Use connect method to connect to the Server 
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
 
    // Get the documents collection 
    var collection = db.collection('temperature_by_hour');
  
    var data = [];  
    // One document equal to one hour
    var limitHours = 24 * 31;
   
    // Get all the aggregation results
    collection.find().sort({'_id': -1}).limit(limitHours).toArray(function(err, docs) {
      assert.equal(err, null);
    
      res.json({result: docs});
    
      db.close();
    });

  });

});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
