// set up ======================================================================
var express  = require('express');
var app = express();                        	// create our app w/express
var router = express.Router();								// use express router for our routes
var morgan = require('morgan');             	// log requests to the console
var bodyParser = require('body-parser');    	// pull information from HTML POST
var fileUpload = require('express-fileupload');
var port = process.env.PORT || 3000;

// configuration ===============================================================
app.use(express.static(__dirname + '/src'));                 		// set the static files location /public/img will be /img for users
app.use('/api/documentation', express.static(__dirname + '/doc'));                 		// set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(fileUpload());
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json/
require('./api/api')(router);																		// API routers
app.use('/', router);

var http = require("https");

var options = {
  "method": "GET",
  "hostname": "tahmoapi.mybluemix.net",
  "port": null,
  "path": "/v1/timeseries/TA00011/rawMeasurements?startDate=2018-06-07&endDate=2018-08-12",
  "headers": {
    "authorization": "Basic NldZSFlUMFhWWTdCWFpIWE43SEJLWUFaODpSazdwWnBkSjBnd3hIVkdyM2twYnBIWDZwOGZrMitwSmhoS0F4Mk5yNzdJ",
    "cache-control": "no-cache",
    "postman-token": "f5be9690-4509-0a30-f656-2d3b984caefa"
  }
};

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./'));

// // viewed at http://localhost:8080
app.get('/api/raw_data', function(req, res) {
    var req = http.request(options, function (response) {
      //console.log(options);
      var chunks = [];
      //res.json(null);

      response.on("data", function (chunk) {
        chunks.push(chunk);
      });

      response.on("end", function () {
        var body = Buffer.concat(chunks);
        json = JSON.parse(body);
        res.json(json);
        console.log(json);
      });
    });
    //req.end();
    //res.sendFile(path.join(__dirname + '/index.html'));
    req.end();
});

app.post('/test', function(req, res){
  console.log(req.body.dataInfo);
  options = {
    "method": "GET",
    "hostname": "tahmoapi.mybluemix.net",
    "port": null,
    "path": "/v1/timeseries/" + req.body.dataInfo  + "/rawMeasurements?startDate=" + req.body.startDateInfo + "&endDate=" + req.body.endDateInfo,
    "headers": {
      "authorization": "Basic NldZSFlUMFhWWTdCWFpIWE43SEJLWUFaODpSazdwWnBkSjBnd3hIVkdyM2twYnBIWDZwOGZrMitwSmhoS0F4Mk5yNzdJ",
      "cache-control": "no-cache",
      "postman-token": "f5be9690-4509-0a30-f656-2d3b984caefa"
    }
  };
  res.send("sent");
});


app.get("/faultinbox", function(req, res){
  res.render("index");
});


app.get('/api/fault_data', function(req, response) {
      var options = {
    "method": "GET",
    "hostname": "raw.githubusercontent.com",
    "port": null,
    "path": "/Sakthisa/Sakthisa.github.io/master/TA00011-1.json",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "5e25a60c-b08b-b980-4bac-faf4265d6576"
    }
    };

    var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      json = JSON.parse(body);
      response.json(json);
      //console.log(json);
    });
    });

    req.end();
});

app.get('/api/ml', function(req, response) {
      var options = {
    "method": "GET",
    "hostname": "raw.githubusercontent.com",
    "port": null,
    "path": "/Sakthisa/Sakthisa.github.io/master/TA00021.json",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "5e25a60c-b08b-b980-4bac-faf4265d6576"
    }
    };

    var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      json = JSON.parse(body);
      response.json(json);
      //console.log(json);
    });
    });

    req.end();
});



app.listen(port, function() {
	//console.log('Listening on port '+ port);
});
