// set up ======================================================================
var express  = require('express');
var app = express();                        	// create our app w/express
var router = express.Router();								// use express router for our routes
var morgan = require('morgan');             	// log requests to the console
var bodyParser = require('body-parser');    	// pull information from HTML POST
var nodemailer = require('nodemailer');
var credentials = require('./config/settings.js');//require('./../credentials');
var port = process.env.PORT || 5000;

var mailTransport = nodemailer.createTransport({
	service: 'Gmail',
	host: "smtp.gmail.com",
	auth: {
		user: credentials.gmail.user,
		pass: credentials.gmail.password,
	} 
});

// configuration ===============================================================
app.use(express.static(__dirname + '/src'));                 		// set the static files location /public/img will be /img for users
app.use('/api/documentation', express.static(__dirname + '/doc'));                 		// set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json/
require('./api/api')(router);																		// API routers
app.use('/', router);

app.listen(port, function() {
	console.log('Listening on port '+ port);
});
