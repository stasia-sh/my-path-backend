// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Path     = require('./app/models/path');

// configure app to use bodyParser()
// this will let us get the data from a POST
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017'); // connect to our database

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /path
// ----------------------------------------------------
router.route('/path')

    // create a path (accessed at POST http://localhost:8080/api/path)
    .post(function(req, res) {
        
        var path = new Path();      // create a new instance of the Path model
        path.name = req.body.name;  // set the path name (comes from the request)
        path.init_location = req.body.init_location;
        path.legs = req.body.legs;
    
        console.log('booooom!!!!');

        // save the path and check for errors
        path.save(function(err, newPath) {
            if (err)
                res.send(err);

            res.json({"_id": newPath.id});
        });
        
    })

    // get all the path (accessed at GET http://localhost:8080/api/path)
    .get(function(req, res) {
        Path.find(function(err, path) {
            if (err)
                res.send(err);

            res.json(path);
        });
    });

// on routes that end in /path/:path_id
// ----------------------------------------------------
router.route('/path/:path_id')

    // get the path with that id (accessed at GET http://localhost:8080/api/path/:path_id)
    .get(function(req, res) {
        Path.findById(req.params.path_id, function(err, path) {
            if (err)
                res.send(err);
            res.json(path);
        });
    })

// update the path with this id (accessed at PUT http://localhost:8080/api/path/:path_id)
    .put(function(req, res) {

        // use our path model to find the path we want
        Path.findById(req.params.path_id, function(err, path) {

            if (err)
                res.send(err);
                
            if (req.body.name)
                path.name = req.body.name;  // update the path info
            
            if (req.body.legs)
                path.legs = req.body.legs;
            
            if (req.body.init_location)
                path.init_location = req.body.init_location;

            // save the path
            path.save(function(err, newPath) {
                if (err)
                    res.send(err);

                res.json({"_id": newPath.id});
            });

        });
    })

// delete the path with this id (accessed at DELETE http://localhost:8080/api/path/:path_id)
    .delete(function(req, res) {
        Path.remove({
            _id: req.params.path_id
        }, function(err, path) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);