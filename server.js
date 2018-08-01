// set up ======================================================================
var express  = require('express');
var app = express();                        	// create our app w/express
var router = express.Router();								// use express router for our routes
var morgan = require('morgan');             	// log requests to the console
var bodyParser = require('body-parser');    	// pull information from HTML POST
var fileUpload = require('express-fileupload');
var nodemailer = require('nodemailer');
var credentials = require('./config/settings.js');//require('./../credentials');
var port = process.env.PORT || 3000;
var AWS = require('ibm-cos-sdk');
var config = {
    endpoint: 's3-api.us-geo.objectstorage.softlayer.net/',
    apiKeyId: 'GcCbLdgTEGAMbTDV_qvGkdgQoFXqtc1P4lej7JnTcNGW',
    ibmAuthEndpoint: 'iam.ng.bluemix.net/oidc/token',
    serviceInstanceId: 'crn:v1:bluemix:public:cloud-object-storage:global:a/16a94a5aac6765350e3b23814baba84b:cfff3f7d-aa64-44b8-9361-56d507fcf62b::'
};
var cos = new AWS.S3(config);
console.log('this is cos', cos);
function getBuckets() {
	console.log('Retrieving list of buckets');
	return cos.listBuckets()
	.promise()
	.then((data) => {
			if (data.Buckets != null) {
					for (var i = 0; i < data.Buckets.length; i++) {
							console.log(`Bucket Name: ${data.Buckets[i].Name}`);
					}
			}
	})
	.catch((e) => {
			console.log(`ERROR: ${e.code} - ${e.message}\n`);
	});
}
function getBucketContents(bucketName) {
    console.log(`Retrieving bucket contents from: ${bucketName}`);
    return cos.listObjects(
        {Bucket: bucketName},
    ).promise()
    .then((data) => {
				console.log('getting bucket contents', data);
        if (data != null && data.Contents != null) {
            for (var i = 0; i < data.Contents.length; i++) {
                var itemKey = data.Contents[i].Key;
                var itemSize = data.Contents[i].Size;
								var params = {Bucket: bucketName, Key: itemKey};
                console.log(`Item: ${itemKey} (${itemSize} bytes).`)
            }
        }
    })
    .catch((e) => {
        console.log(`ERROR: ${e.code} - ${e.message}\n`);
    });
}
getBuckets();
getBucketContents('tickets');
/*
client.getContainers(function(error, containers) {
	if (error) {
		console.log('error retrieving containers', error);
	} else {
		console.log('containers', containers);
	}
});
*/
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
app.use(fileUpload());
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json/
require('./api/api')(router);																		// API routers
app.use('/', router);

app.listen(port, function() {
	console.log('Listening on port '+ port);
	console.log('process.env', process.env);
});
