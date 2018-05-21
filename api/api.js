/**
 * DB Configuration
 */
var fetch = require('node-fetch');
var fs = require('fs-path');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var credentials =require('../config/settings.js');
var mailTransport = nodemailer.createTransport({ 
 service: 'Gmail',
 host: "smtp.gmail.com",
 auth: {
  user: credentials.gmail.user,
  pass: credentials.gmail.password,
 } 
});

// Replace by user's info during configuration
var db = "mongodb://sensordx:helloworld@ds161049.mlab.com:61049/issue_tracker";

mongoose.connect(db, function(err, response) {
 if (err)
  console.log('Fail to connect to '+ db);
 else
  console.log('Successfully connected to '+ db);
});

/**
 * Initiate Models
 */
var Issue = require('./models/issues');
var Label = require('./models/labels');
var User = require('./models/users');
var SensorTypes = require('./models/sensorTypes');
var Stations = require('./models/stations');
const AuthCtrl = require('./controllers/Auth');
const UserCtrl = require('./controllers/User');
const IssueCtrl = require('./controllers/Issue');
const SiteCtrl = require('./controllers/Site');
const CommentCtrl = require('./controllers/Comment');
const UploadCtrl = require('./controllers/Upload');
var tools = require('./tools');

/**
 * Export API routers
 */
module.exports = function(router) {
	AuthCtrl(router);
	UserCtrl(router);
	IssueCtrl(router);
	SiteCtrl(router);
	CommentCtrl(router);
	UploadCtrl(router);
 /**
  * @api {get} /api/labels Get all labels
  * @apiVersion 1.0.0
  * @apiName GetLabels
  * @apiGroup Label
  *
  * @apiExample Usage:
  * curl -i http://localhost/api/labels
 *
  * @apiExample Type Param Usage:
  * curl -i http://localhost/api/labels?type=name
 *
  * @apiExample User Param Usage:
  * curl -i http://localhost/api/labels?user=rene
 *
  * @apiParam  {String}    [type=null]    Get All Labels Name when type=name
  * @apiParam  {String}    [user=admin]   Get All Labels Created by a Specific User
  *
  * @apiSuccess {String}    user        User Who Created the Label
  * @apiSuccess {String}    name        Name of the Label
  *
  * @apiSuccessExample Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   user: "rene",
  *   name: "help wanted",
  * },
  * {
  *   user: "admin",
  *   name: "sensor failure",
  * }
 *
  * @apiSuccessExample Type Param Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   name: "help wanted",
  * },
  * {
  *   name: "sensor failure",
  * }
  *
  * @apiSuccessExample User Param Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   user: "rene",
  *   name: "bug",
  * },
  * {
  *   user: "rene",
  *   name: "sensor failure",
  * }
 *
  */
 router.get('/api/labels', function(request, response) {
  var type = request.query.type;
  var data = [];
  Label.find({$or: [{user: 'admin'}, {user: request.query.user}]}, function(err, labels) {
   if (err) {
    response.status(404).send(err);
   } else {
    switch(type) {
     case 'name':
      data = tools.label(labels);
      break;
     default:
      data = labels;
      break;
    }
    response.status(200).send(data);
   }
  });
 });

 /**
  * @api {post} /api/labels Create a new label
  * @apiVersion 1.0.0
  * @apiName PostLabel
  * @apiGroup Label
  *
  * @apiParam {String}    user        User Who Created the Label
  * @apiParam {String}    name        Name of the Label
  *
  * @apiSuccessExample Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   success: "New label created",
  * }
  */
 router.post('/api/labels', function(request, response) {
  var label = new Label({
   user: request.body.user,
   name: request.body.name
  });
  label.save(function(err, data) {
   if (err) {
    response.status(404).send({error: err});
   } else {
    response.status(200).send({success: "New label created"});
   }
  });
 });

 /**
  * @api {get} /api/users Get all users
  * @apiVersion 1.0.0
  * @apiName GetUser
  * @apiGroup User
  * @apiPermission admin
  *
  * @apiExample Usage:
  * curl -i http://localhost/api/users
 *
  * @apiExample Type Param Usage:
  * curl -i http://localhost/api/users?type=fullname
  * 
  * @apiParam {String}    [type=null]   When typ=fullname, return users full name
  *
  * @apiSuccess {String}    _id         User's ID.
  * @apiSuccess {String}    username    User's Account Name
  * @apiSuccess {String}    first_name  User's First Name
  * @apiSuccess {String}    last_name   User's Last Name
  * @apiSuccess {String}    email       User's Email Address
  * @apiSuccess {Date}      created_at  Registration Date
  * @apiSuccess {Number}    __v        Version Number of Object
  * @apiSuccess {Number[]}  projects    Project ID Of Projects User Is Part Of
  * @apiSuccess {String}    name        User's Full Name
  *
  * @apiSuccessExample Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   _id: "58ab7e4fc9e66c7095934c7b",
  *   username: "renay007",
  *   first_name: "Rene",
  *   last_name: "Midouin",
  *   email: "renemidouin@gmail.com",
  *   created_at: "Mon Feb 20 2017 18:39:59 GMT-0500 (EST)",
  *   __v: 0,
  *   projects: [ ]
  * },
  * {
  *   _id: "58ab7eedc9e66c7095934c7d",
  *   username: "rere34",
  *   first_name: "Rene",
  *   last_name: "Descartes",
  *   email: "renemidouin@yahoo.com",
  *   password: "04uas3094609N$@*(*_($",
  *   created_at: "Mon Feb 20 2017 18:42:37 GMT-0500 (EST)",
  *   __v: 0,
  *   projects: [ ]
  * }
 *
  * @apiSuccessExample Type Param Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   name: "Rene Midouin"
  * },
  * {
  *   name: "Rene Descartes"
  * }
  *
  * @apiError NoAccessRight Only authenticated Admins can access the data.
  */

 /**
  * @api {post} /api/users Create a new user
  * @apiVersion 1.0.0
  * @apiName PostUser
  * @apiGroup User
  * @apiPermission admin
  *
  * @apiParam  {String}    username    User's Account Name
  * @apiParam  {String}    first_name  User's First Name
  * @apiParam  {String}    last_name   User's Last Name
  * @apiParam  {String}    password    User's Password
  * @apiParam  {String}    email       User's Email Address
  *
  * @apiSuccessExample Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   success: "New user created"
  * }
  */

 /**
  * @api {get} /api/issues Get all issues
  * @apiVersion 1.0.0
  * @apiName GetIssues
  * @apiGroup Issue
  * @apiDescription Note: When type=modified, get an array of css class names 
  * for each label. Each class name corresponsds to a specific label color. 
  * If a new label is added, say "crazy bug", user needs to add in the main 
  * css file a class named .crazy-bug. See the "CSS EXample" below.
	*
	* @apiParamExample {json} CSS Example
	* .crazy-bug { 
	*   color: 'red'
	* }
  *
  * @apiExample Usage:
  * curl -i http://localhost/api/issues
  *
  * @apiExample Type Param Usage:
  * curl -i http://localhost/api/issues?type=modified
  *
  * @apiExample Status Param Usage:
  * curl -i http://localhost/api/issues?status=close
  *
  * @apiParam  {String}    [type]         Get All Issues Labels Class Name When type=modified (see note)
  * @apiParam  {String}    [status=all]     Get All Issues by Status [all, open, close]
  *
  * @apiSuccess {String}    _id          Issue ID
  * @apiSuccess {String}    title        Issue Title
  * @apiSuccess {String}    description  Detailed Descrition of Issue
  * @apiSuccess {String}    assignee     Who the Issue Was Assigned To
  * @apiSuccess {String}    priority     Priority Level of the Issue [LOW, NORMAL, HIGH]
  * @apiSuccess {String}    station      Station's Code [ADAX, ACME, ...]
  * @apiSuccess {String}    status       Current Status of Issue [Open, Close]
  * @apiSuccess {Date}      updated_at   Date When the Issue Was Updated 
  * @apiSuccess {Date}      due_date    Deadline for when the Issue Needs to Be Fixed
  * @apiSuccess {Date}      created_at   Date When the Issue Was Created 
  * @apiSuccess {Number}    __v          Version Number of Object
  * @apiSuccess {String[]}  labels       All Labels that Were Tagged to this Issue [bug, help-wanted, etc ...]
  *
  * @apiSuccessExample Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   _id: "58b256013216c21250e536e3",
  *   title: "Yes! New Issue - YOOOOOOOOO",
  *   description: "This is a new issue and we're happy about it!",
  *   assignee: "Rene Descartes",
  *   priority: "LOW",
  *   station: "Station 2",
  *   status: "open",
  *   updated_at: "2017-05-10T18:11:00.912Z",
  *   due_date: "2017-07-26T04:00:00.000Z",
  *   created_at: "2017-02-26T04:13:53.147Z",
  *   __v: 0,
  *   labels: [
  *     "help wanted",
  *     "question"
  *   ]
  * }
  *
  * @apiSuccessExample Type Param Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   _id: "58b256013216c21250e536e3",
  *   title: "Yes! New Issue - YOOOOOOOOO",
  *   description: "This is a new issue and we're happy about it!",
  *   assignee: "Rene Descartes",
  *   priority: "LOW",
  *   station: "Station 2",
  *   status: "open",
  *   updated_at: "2017-05-10T18:11:00.912Z",
  *   due_date: "2017-07-26T04:00:00.000Z",
  *   created_at: "2017-02-26T04:13:53.147Z",
  *   labels: [
  *   "help wanted",
  *   "question"
  *   ],
  *   labels_class: [
  *     "sensor-failure",
  *     "help-wanted"
  *   ]
  * }
  *
  * @apiSuccessExample Status Param Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   _id: "58b2f97c5f4c8f3037cd88b6",
  *   title: "Sensor failure",
  *   description: "Hello There",
  *   assignee: "Rene Descartes",
  *   priority: "LOW",
  *   station: "Station 2",
  *   status: "close",
  *   updated_at: "2017-02-26T18:55:42.478Z",
  *   due_date: "2017-03-30T04:00:00.000Z",
  *   created_at: "2017-02-26T15:51:24.767Z",
  *   __v: 0,
  *   labels: [
  *     "sensor failure",
  *     "help wanted"
  *   ]
  * },
  * {
  *   _id: "591e33d679002c889fde7334",
  *   title: "Temperature Sensor - Failure Detected",
  *   description: "QFlag: 0 (good data)",
  *   assignee: "",
  *   priority: "HIGH",
  *   station: "ADAX",
  *   status: "close",
  *   updated_at: "2017-05-18T23:54:37.767Z",
  *   due_date: "2017-05-18T04:00:00.000Z",
  *   created_at: "2017-05-18T23:52:54.178Z",
  *   __v: 0,
  *     labels: [
  *     "bug"
  *   ]
  * }
  */

 /**
  * @api {get} /api/issues/:id  Get issue by id
  * @apiVersion 1.0.0
  * @apiName GetSpecificIssue
  * @apiGroup Issue
  *
  * @apiExample Usage:
  * curl -i http://localhost/api/issues/58b256013216c21250e536e3
  *
  * @apiExample Type Param Usage:
  * curl -i http://localhost/api/issues/58b256013216c21250e536e3?type=modified
  *
  * @apiParam  {String}    id    ObjectId of Issue
  * @apiParam  {String}    [type]  Output labels_class array when type=modified. See GET /api/issues
  *
  * @apiSuccessExample Type Param Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   _id: "58b256013216c21250e536e3",
  *   title: "Yes! New Issue - YOOOOOOOOO",
  *   description: "This is a new issue and we're happy about it!",
  *   assignee: "Rene Descartes",
  *   priority: "LOW",
  *   station: "Station 2",
  *   status: "open",
  *   updated_at: "2017-05-10T18:11:00.912Z",
  *   due_date: "2017-07-26T04:00:00.000Z",
  *   created_at: "2017-02-26T04:13:53.147Z",
  *   labels: [
  *   "help wanted",
  *   "question"
  *   ]
  * }
  *
  * @apiSuccessExample Type Param Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   _id: "58b256013216c21250e536e3",
  *   title: "Yes! New Issue - YOOOOOOOOO",
  *   description: "This is a new issue and we're happy about it!",
  *   assignee: "Rene Descartes",
  *   priority: "LOW",
  *   station: "Station 2",
  *   status: "open",
  *   updated_at: "2017-05-10T18:11:00.912Z",
  *   due_date: "2017-07-26T04:00:00.000Z",
  *   created_at: "2017-02-26T04:13:53.147Z",
  *   labels: [
  *   "help wanted",
  *   "question"
  *   ],
  *   labels_class: [
  *     "sensor-failure",
  *     "help-wanted"
  *   ]
  * }
  */

 /**
  * @api {post} /api/issues Create an issue
  * @apiVersion 1.0.0
  * @apiName PostIssues
  * @apiGroup Issue
  *
  * @apiParam  {String}    title         Issue Title
  * @apiParam  {String}    description   Detailed Descrition of Issue
  * @apiParam  {String}    assignee      Who the Issue Was Assigned To
  * @apiParam  {String}    priority      Priority Level of the Issue [LOW, NORMAL, HIGH]
  * @apiParam  {String}    station       Station's Code [ADAX, ACME, ...]
  * @apiParam  {Date}      due_date      Deadline for when the Issue Needs to Be Fixed By
  * @apiParam  {String[]}  labels        All Labels that Were Tagged to this Issue [bug, help-wanted, etc ...]
  *
  * @apiSuccessExample Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   success: "New issue created",
  * }
  */

 /**
  * @api {put} /api/issues Modify issue(s)
  * @apiVersion 1.0.0
  * @apiName PutIssues
  * @apiGroup Issue
  *
  * @apiParam  {String[]}  ids         	 Array of ids to update
  * @apiParam  {String}    title         Issue Title
  * @apiParam  {String}    description   Detailed Descrition of Issue
  * @apiParam  {String}    assignee      Who the Issue Was Assigned To
  * @apiParam  {String}    priority      Priority Level of the Issue [LOW, NORMAL, HIGH]
  * @apiParam  {String}    station       Station's Code [ADAX, ACME, ...]
  * @apiParam  {Date}      due_date      Deadline for when the Issue Needs to Be Fixed By
  * @apiParam  {String[]}  labels        All Labels that Were Tagged to this Issue [bug, help-wanted, etc ...]
  *
  * @apiSuccessExample Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   updated: true
  * }
  */

 /**
  * @api {delete} /api/issues/:id Delete an issue
  * @apiVersion 1.0.0
  * @apiName DeleteIssue
  * @apiGroup Issue
  *
  * @apiParam  {String}  id         	 Id of issue to remove
  *
  * @apiSuccessExample Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   deleted: true
  * }
  */

 /**
  * @api {get} /api/issues/station/:name  Get issue by station name
  * @apiVersion 1.0.0
  * @apiName GetSpecificIssueStationName
  * @apiGroup Issue
  *
  * @apiExample Usage:
  * curl -i http://localhost/api/issues/station/ADAX
  *
  * @apiExample Type Param Usage:
  * curl -i http://localhost/api/issues/station/ADAX?type=modified
  *
  * @apiParam  {String}    name    Station Name
  *
  * @apiSuccessExample Type Param Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   _id: "58b256013216c21250e536e3",
  *   title: "Yes! New Issue - YOOOOOOOOO",
  *   description: "This is a new issue and we're happy about it!",
  *   assignee: "Rene Descartes",
  *   priority: "LOW",
  *   station: "ADAX",
  *   status: "open",
  *   updated_at: "2017-05-10T18:11:00.912Z",
  *   due_date: "2017-07-26T04:00:00.000Z",
  *   created_at: "2017-02-26T04:13:53.147Z",
  *   labels: [
  *   "help wanted",
  *   "question"
  *   ]
  * }
  *
  * @apiSuccessExample Type Param Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   _id: "58b256013216c21250e536e3",
  *   title: "Yes! New Issue - YOOOOOOOOO",
  *   description: "This is a new issue and we're happy about it!",
  *   assignee: "Rene Descartes",
  *   priority: "LOW",
  *   station: "ADAX",
  *   status: "open",
  *   updated_at: "2017-05-10T18:11:00.912Z",
  *   due_date: "2017-07-26T04:00:00.000Z",
  *   created_at: "2017-02-26T04:13:53.147Z",
  *   labels: [
  *   "help wanted",
  *   "question"
  *   ],
  *   labels_class: [
  *     "sensor-failure",
  *     "help-wanted"
  *   ]
  * }
  */
 router.get('/api/issues/station/:name', function(request, response) {
  var type = request.query.type;
  var name = request.params.name;
  var status = {station: name};
  var data = [];
  Issue.find(status, function(err, issues) {
   if (err) {
    response.status(404).send(err);
   } else {
    switch(type) {
     case 'modified':
      data = tools.modify(issues);
      break;
     default:
      data = issues;
      break;
    }
    response.status(200).send(data);
   }
  });
 });

 /**
  * @api {put} /api/issues/station Modify an issue by station name
  * @apiVersion 1.0.0
  * @apiName PutIssuesStationName
  * @apiGroup Issue
  *
  * @apiParam  {String}    title         Issue Title
  * @apiParam  {String}    description   Detailed Descrition of Issue
  * @apiParam  {String}    assignee      Who the Issue Was Assigned To
  * @apiParam  {String}    priority      Priority Level of the Issue [LOW, NORMAL, HIGH]
  * @apiParam  {Date}      due_date      Deadline for when the Issue Needs to Be Fixed By
  * @apiParam  {String[]}  labels        All Labels that Were Tagged to this Issue [bug, help-wanted, etc ...]
  *
  * @apiSuccessExample Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   updated: true
  * }
  */
 router.put('/api/issues/station', function(req, res) {
  if(req.body.ids.length > 0) {
   var name = req.body.name;
   var update = {};
   var isUpdated = false;

   if (req.body.title) {
    update.title = req.body.title;
    isUpdated = true;
   }
   if (req.body.description) {
    update.description = req.body.description;
    isUpdated = true;
   }
   if (req.body.assignee) {
    update.assignee = req.body.assignee;
    isUpdated = true;
   }

   if (req.body.labels.length > 0) {
    update.labels = req.body.labels;
    isUpdated = true;
   }

   if (req.body.priority) {
    update.priority = req.body.priority;
    isUpdated = true;
   }

   if (req.body.due_date) {
    update.due_date = req.body.due_date;
    isUpdated = true;
   }

   if (req.body.status) {
    update.status = req.body.status;
    isUpdated = true;
   }

   if (isUpdated) {
    update.updated_at = new Date();
   }

   console.log(update);
   Issue.update({station: name}, 
          {$set: update}, 
          { multi: true }, 
          function(elm) {
           res.send({updated: true})
          }
         );
  } else {
   res.status(404).send({updated: false});
  }
 });

 /**
  * GET sites info
  * Usage:
  *  - /api/sites          [get all sites lat, long, elevation]
  *  - /api/sites?type=geojson   [get all sites lat, long, elevation, sitename, sitecode in geojson format]
  */
 /**
  * @api {get} /api/issues Get all stations metadata
  * @apiVersion 1.0.0
  * @apiName GetStationsMetadata
  * @apiGroup Station
  *
  * @apiExample Usage:
  * curl -i http://localhost/api/sites
  *
  * @apiExample Type Param Usage:
  * curl -i http://localhost/api/sites?type=geojson
  *
  * @apiParam  {String}    [type=null]   Format response. [null, geojson]
  *
  * @apiSuccess {Number}    SiteID           Site ID Number
  * @apiSuccess {String}    SiteCode         Station Code
  * @apiSuccess {String}    SiteName         Station Full Name
  * @apiSuccess {Number}    Latitude         Station Latitude
  * @apiSuccess {Number}    Longitude        Station Longitude
  * @apiSuccess {Number}    Elavation_m      Station Elevation in Meters
  *
  * @apiSuccessExample Success-Response:
  * HTTP/1.1 200 OK
	* {
	*   SiteID: 1,
	*   SiteCode: "ACME",
	*   SiteName: "Acme",
	*   Latitude: 34.80833,
	*   Longitude: -98.02325,
	*   Elevation_m: 397
	* },
	* {
	*   SiteID: 2,
	*   SiteCode: "ADAX",
	*   SiteName: "Ada",
	*   Latitude: 34.79851,
	*   Longitude: -96.66909,
	*   Elevation_m: 295
	* },
  *
  * @apiSuccessExample Type Param Success-Response:
  * HTTP/1.1 200 OK
	* {
	*   features: [
	*     {
	*       geometry: {
	*         coordinates: [
	*          -98.02325,
	*           34.80833,
	*           397
	*         ],
	*         type: "Point"
	*       },
	*       properties: {
	*         Country: "USA",
	*         Date of installation: "",
	*         Mount height (meters): 397,
	*         Site name: "Acme",
	*         Station ID: "ACME",
	*         Station site type: "",
	*         Station status: "Delay"
	*       },
	*       type: "Feature"
	*     },
	*     {
	*       geometry: {
	*         coordinates: [
	*          -96.66909,
	*           34.79851,
	*           295
	*         ],
	*         type: "Point"
	*       },
	*       properties: {
	*         Country: "USA",
	*         Date of installation: "",
	*         Mount height (meters): 295,
	*         Site name: "Ada",
	*         Station ID: "ADAX",
	*         Station site type: "",
	*         Station status: "Closed"
	*       },
	*       type: "Feature"
	*     }
	*   ],
	*   type: "FeatureCollection"
	* }
  */
 router.get('/api/get_sites', function(request, response) {
  var type = request.query.type;
  var data = [];
	fetch('http://localhost:1234/v1/stations')
	.then(function(res) {
		return res.json();
	})
	.then(function(json) {
		data = json['stations'];
		//const {
		//	elevation,
		//	id,
		//	name,
		//	deviceId,
		//	location,
		//} = data;
		//
		//const result = {
		//	SiteCode: id,
		//	SiteName: name,
		//	DeviceId: deviceId,
		//	Elevation_m: elevation,
		//	Latitude: location.lat,
		//	Longitude: location.lng,
		//};
    switch(type) {
     case 'geojson':
      data = tools.tahmoGeojson(data);
      break;
     case 'modifyDate':
      data = tools.modifyDate(data);
      break;
     case 'manage':
      data = tools.manage(data);
      break;
     case 'tahmo':
      data = tools.tahmo(data);
      break;
     default:
      break;
    }
    //response.status(200).send(data);
		response.status(200).send(data);
		console.log(json);
	})
	.catch(function(err) {
		console.log(err);
	});
 });

 /**
  * @api {get} /api/stationdata/:sitecode  Get data for specific station 
  * @apiVersion 1.0.0
  * @apiName GetStationData
  * @apiGroup Station
  *
  * @apiExample Usage:
  * curl -i http://localhost/api/stationdata/ADAX
  *
  * @apiExample Limit Param Usage:
  * curl -i http://localhost/api/stationdata/ADAX?limit=2
	*
  * @apiExample Type Param Usage:
  * curl -i http://localhost/api/stationdata/ADAX?type=sensorify&limit=1
	*
  * @apiExample Sensor Param Usage:
  * curl -i http://localhost/api/stationdata/ADAX?type=graph&sensor=TAIR&limit=2
	*
  *
  * @apiSuccess {Number}    ObservationID       
  * @apiSuccess {String}    DateTimeUTC        
  * @apiSuccess {String}    SiteCode          
	* @apiSuccess {Number}    RELH
	* @apiSuccess {Number}    QRELH
	* @apiSuccess {Number}    TAIR
	* @apiSuccess {Number}    QTAIR
	* @apiSuccess {Number}    WSPD
	* @apiSuccess {Number}    QWSPD
	* @apiSuccess {Number}    WVEC
	* @apiSuccess {Number}    QWVEC
	* @apiSuccess {Number}    WDIR
	* @apiSuccess {Number}    QWDIR
	* @apiSuccess {Number}    WDSD
	* @apiSuccess {Number}    QWDSD
	* @apiSuccess {Number}    WSSD
	* @apiSuccess {Number}    QWSSD
	* @apiSuccess {Number}    WMAX
	* @apiSuccess {Number}    QWMAX
	* @apiSuccess {Number}    RAIN
	* @apiSuccess {Number}    QRAIN
	* @apiSuccess {Number}    PRES
	* @apiSuccess {Number}    QPRES
	* @apiSuccess {Number}    SRAD
	* @apiSuccess {Number}    QSRAD
	* @apiSuccess {Number}    TA9M
	* @apiSuccess {Number}    QTA9M
	* @apiSuccess {Number}    WS2M
	* @apiSuccess {Number}    QWS2M
	* @apiSuccess {Number}    TS10
	* @apiSuccess {Number}    QTS10
	* @apiSuccess {Number}    TB10
	* @apiSuccess {Number}    QTB10
	* @apiSuccess {Number}    TS05
	* @apiSuccess {Number}    QTS05
	* @apiSuccess {Number}    TB05
	* @apiSuccess {Number}    QTB05
	* @apiSuccess {Number}    TS30
	* @apiSuccess {Number}    QTS30
	* @apiSuccess {Number}    BATV
	* @apiSuccess {Number}    Visit
	*
  * @apiParam  {String}    sitecode        Station Site Code
  * @apiParam  {String}    [limit=null]    Limit Query Result
  * @apiParam  {String}    [type=null]     Format response when type=[graph, sensorify]. 
	* 																		   <br/>When graph, get all sensor data formatted as data points. 
	* 																		   <br/>When sensorify, get all sensor data broken down by sensor types.
  * @apiParam  {String}    [sensor=null]   Retrive data only from that specific sensor
  *
  * @apiSuccessExample Limit Param Success-Response:
  * HTTP/1.1 200 OK
	* {
	*   ObservationID: 210528,
	*   DateTimeUTC: "2009-12-31 23:55:00",
	*   SiteCode: "ADAX",
	*   RELH: 75,
	*   QRELH: 0,
	*   TAIR: -0.1,
	*   QTAIR: 0,
	*   WSPD: 4,
	*   QWSPD: 0,
	*   WVEC: 3.9,
	*   QWVEC: 0,
	*   WDIR: 354,
	*   QWDIR: 0,
	*   WDSD: 12.3,
	*   QWDSD: 0,
	*   WSSD: 1.1,
	*   QWSSD: 0,
	*   WMAX: 7.5,
	*   QWMAX: 0,
	*   RAIN: 0.25,
	*   QRAIN: 0,
	*   PRES: 991.38,
	*   QPRES: 0,
	*   SRAD: 0,
	*   QSRAD: 0,
	*   TA9M: -0.2,
	*   QTA9M: 0,
	*   WS2M: 2.6,
	*   QWS2M: 0,
	*   TS10: -998,
	*   QTS10: -9,
	*   TB10: -998,
	*   QTB10: -9,
	*   TS05: -998,
	*   QTS05: -9,
	*   TB05: -998,
	*   QTB05: -9,
	*   TS30: -998,
	*   QTS30: -9,
	*   BATV: 12.5,
	*   Visit: 0
	* },
	* {
	*   ObservationID: 210527,
	*   DateTimeUTC: "2009-12-31 23:50:00",
	*   SiteCode: "ADAX",
	*   RELH: 74.6,
	*   QRELH: 0,
	*   TAIR: -0.1,
	*   QTAIR: 0,
	*   WSPD: 4.3,
	*   QWSPD: 0,
	*   WVEC: 4.2,
	*   QWVEC: 0,
	*   WDIR: 353,
	*   QWDIR: 0,
	*   WDSD: 9.8,
	*   QWDSD: 0,
	*   WSSD: 0.9,
	*   QWSSD: 0,
	*   WMAX: 7,
	*   QWMAX: 0,
	*   RAIN: 0.25,
	*   QRAIN: 0,
	*   PRES: 991.25,
	*   QPRES: 0,
	*   SRAD: 0.1,
	*   QSRAD: 0,
	*   TA9M: -0.2,
	*   QTA9M: 0,
	*   WS2M: 2.9,
	*   QWS2M: 0,
	*   TS10: -998,
	*   QTS10: -9,
	*   TB10: -998,
	*   QTB10: -9,
	*   TS05: -998,
	*   QTS05: -9,
	*   TB05: -998,
	*   QTB05: -9,
	*   TS30: -998,
	*   QTS30: -9,
	*   BATV: 12.5,
	*   Visit: 0
	* }
  *
  * @apiSuccessExample Type=sensorify Success-Response:
  * HTTP/1.1 200 OK
	* {
	*   data: [
	*     {
	*       name: "Temperature",
	*       icon: "temperature.svg",
	*       time_stamp: "2009-12-31 23:55:00",
	*       reading: -0.1,
	*       unit: "&#8451;",
	*       QFlag: 0,
	*       QFlagText: "good data"
	*     },
	*     {
	*       name: "Relative Humidity",
	*       icon: "relative_humidity.svg",
	*       time_stamp: "2009-12-31 23:55:00",
	*       reading: 75,
	*       unit: "%",
	*       QFlag: 0,
	*       QFlagText: "good data"
	*     },
	*     {
	*       name: "Pressure",
	*       icon: "pressure.svg",
	*       time_stamp: "2009-12-31 23:55:00",
	*       reading: 991.38,
	*       unit: "mbar",
	*       QFlag: 0,
	*       QFlagText: "good data"
	*     },
	*     {
	*       name: "Precipitation",
	*       icon: "precipitation.svg",
	*       time_stamp: "2009-12-31 23:55:00",
	*       reading: 0.25,
	*       unit: "mm",
	*       QFlag: 0,
	*       QFlagText: "good data"
	*     },
	*     {
	*       name: "Radiation",
	*       icon: "radiation.svg",
	*       time_stamp: "2009-12-31 23:55:00",
	*       reading: 0,
	*       unit: "W/m^2",
	*       QFlag: 0,
	*       QFlagText: "good data"
	*     },
	*     {
	*       name: "Wind",
	*       icon: "wind.svg",
	*       time_stamp: "2009-12-31 23:55:00",
	*       reading: 4,
	*       unit: "m/s",
	*       QFlag: 0,
	*       QFlagText: "good data"
	*     }
	*   ],
	*   BATV: 12.5
	* }
  * @apiSuccessExample Sensor Param  Success-Response:
  * HTTP/1.1 200 OK
	* [
	*   [
	*     1199145600000,
	*     6.9
	*   ],
	*   [
	*     1199145900000,
	*     6.7
	*   ]
	* ]
  */
 router.get('/api/stationdata/:sitecode', function(request, response) {
  var sitecode = request.params.sitecode;
  var limit = request.query.limit ? "LIMIT "+request.query.limit : "";
  var order = request.query.order == "desc" ? "DESC " : "ASC ";
  var type = request.query.type;
  var sensor = request.query.sensor;
	/*
	fetch('http://localhost:3000/v1/timeseries/'+sitecode+'/rawmeasurements')
	.then(function(res) {
		return res.json();
	})
	.then(function(json) {
		data = json;
    switch(type) {
     case 'sensorify':
      data = tools.sensorifyTahmo(data, sensor);
      break;
     case 'graph':
      data = tools.prepareTahmoGraphData(data, sensor);
      break;
     default:
      break;
    }
    response.status(200).send(data);
		//console.log(json);
	})
	.catch(function(err) {
		console.log(err);
	});
	*/
  if (sensor) {
   var query = "SELECT DateTimeUTC, "+sensor+", Q"+sensor+" FROM DataValues WHERE SiteCode = '"+sitecode+"' ORDER BY DateTimeUTC "+order+limit;
  } else {
   var query = "SELECT * FROM DataValues WHERE SiteCode = '"+sitecode+"' ORDER BY DateTimeUTC DESC "+limit;
  }
  console.log(query);
  Stations.all(query, function(err, row) {
   if(err) {
    response.status(404).send(err);
    console.log(err);
   } else {
    switch(type) {
     case 'sensorify':
      data = tools.sensorify(row);
      break;
     case 'graph':
      data = tools.prepareGraphData(row, sensor);
      break;
     default:
      data = row;
      break;
    }
    response.status(200).send(data);
    //console.log(data);
   }
  });
 });
 /**
  * POST sendmail
  * Usage:
  *  - /api/sendmail -d {
  *              from: String,
  *              to: String,
  *              subject: String,
  *              text: String
  *             }
  *  
  */
 /**
  * @api {post} /api/sendmail Send a new email
  * @apiVersion 1.0.0
  * @apiName PostMail
  * @apiGroup Mail
  *
  * @apiParam {String}    from      Email Sender
  * @apiParam {String}    to        Email Recipient
  * @apiParam {String}    subject   Email Subject
  * @apiParam {String}    text      Email Body
  *
  * @apiSuccessExample Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   success: "Email was sent",
  * }
  */
 router.post('/api/sendmail', function(req, res) {
   var sender = req.body.from;
   var receiver = req.body.to;
   var subject = req.body.subject;
   var text = req.body.text;

   mailTransport.sendMail({
    from: sender + ' <renemidouin@gmail.com>',
    to: receiver,
    subject: subject,
    text: text
   }, function(err){
      if(err) {
       console.error( 'Unable to send email: ' + err );
       res.status(200).send({error: "Unable to send email: " + err});
      } else {
       console.log('Mail sent');
       res.status(200).send({success: "Email was sent"});
      }
   });
 });

 /**
  * @api {get} /api/sensors/types Get all types of sensors
  * @apiVersion 1.0.0
  * @apiName GetSensorTypes
  * @apiGroup Sensor
  *
  * @apiExample Usage:
  * curl -i http://localhost/api/sensors/types
 *
  * @apiExample Type Param Usage:
  * curl -i http://localhost/api/sensors/types
  * 
  * @apiSuccess {String}    _id         Sensor Type's ID.
  * @apiSuccess {String}    name    		Sensor's name
  * @apiSuccess {String}    description Brief description of what the sensor is
  * @apiSuccess {String}    notes   		Extra details on the sensor
  *
  * @apiSuccessExample Success-Response:
  * HTTP/1.1 200 OK
  *	{
  *			"_id": {
  *					"$oid": "5977e216f36d286610572428"
  *			},
  *			"name": "TAIR",
  *			"description": "Air Temperature (1.5 m) in deg C",
  *			"notes": ""
  *	},
	* {
	* 		"_id": {
	* 				"$oid": "5977e4e8f36d28661057257b"
	* 		},
	* 		"name": "RELH",
	* 		"description": "Relative Humidity (1.5 m) in %",
	* 		"notes": ""
	* }
  *
  */
 router.get('/api/sensors/types', function(request, response) {
  SensorTypes.find({}, function(err, sensors) {
   if (err) {
    response.status(404).send(err);
   } else {
    response.status(200).send(sensors);
   }
  });
 });

	router.post('/api/fs/:action', function(req, res) {
		var action = req.params.action;
		console.log('fs action: '+action);
		switch (action) {
			case 'write':
				fs.writeFile(req.body.filename, req.body.data, function(err) {
					if (err) console.log('file error - ', err);	
				});
				res.status(200).send({success: true});
				break;
			default:
				res.status(200).send({success: false});
				break;
		}
	});
};
