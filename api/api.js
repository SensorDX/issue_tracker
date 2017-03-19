/**
 * DB Configuration
 */
var mongoose = require('mongoose');
//var db = "mongodb://localhost/issue_tracker";
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
var Stations = require('./models/stations');
var tools = require('./tools');

/**
 * Export API routers
 */
module.exports = function(router) {
	/**
	 * POST labels
	 * Usage:
	 *	 - /api/labels/new -d {
	 * 													user: String,
	 * 													name: String
	 * 												}
	 */
	router.post('/api/labels/new', function(request, response) {
		var label = new Label({
			user: request.body.user,
			name: request.body.name
		});
		label.save(function(err, data) {
			if (err) {
				response.status(404).send(err);
			} else {
				response.status(200).send(data);
			}
		});
	});

	/**
	 * GET labels
	 * Usage:
	 *	 - /api/labels						[all labels info]
	 *	 - /api/labels?type=name 	[all labels name]
	 *	 - /api/labels?user=name 	[all labels from that specific user (including custom labels)]
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
	 * GET users
	 * Usage:
	 *	 - /api/users									[all users info]
	 *	 - /api/users?type=fullname 	[all users first name and last name]
	 */
	router.get('/api/users', function(request, response) {
		var category = request.query.category;
		var type = request.query.type;
		var data = [];
		User.find({}, function(err, users) {
			if (err) {
				response.status(404).send(err);
			} else {
				switch(type) {
					case 'fullname':
						data = tools.assignee(users);
						break;
					default:
						data = users;
						break;
				}
				response.status(200).send(data);
			}
		});
	});

	/**
	 * POST users
	 * Usage:
	 *	 - /api/users/new -d {
	 * 													username: String,
	 * 													first_name: String,
	 * 													last_name: String,
	 * 													email: String,
	 * 													password: Number,
	 * 													projects: [],
	 * 													created_at: Default = New Date()
	 * 												}
	 */
	router.post('/api/users', function(request, response) {
		var data = {
			username: request.body.username,
			first_name: request.body.first_name,
			last_name: request.body.last_name,
			email: request.body.email,
			password: request.body.password,
			projects: [],
			created_at: new Date()
		};
		var user = new User(data);
		user.save(function(err, data) {
			if (err) {
				response.status(404).send(err);
			} else {
				response.status(200).send(data);
			}
		});
	});

	/**
	 * GET issues
	 * Usage:
	 *	 - /api/issues?status={all,open,,close}&type=modified		[modify json output]
	 *	 - /api/issues?status=all																[all tickets]
	 *	 - /api/issues?status=open															[open tickets]
	 *	 - /api/issues?status=close															[close tickets]
	 *	 - /api/issues?status=id&id=:id													[get issue by _id]
	 */
	router.get('/api/issues', function(request, response) {
		var type = request.query.type;
		var id = request.query.id;
		var status = {};
		switch(request.query.status) {
			case 'all':
				status = {};
				break;
			case 'id':
				status = {_id: request.query.id};
				break;
			default:
				status = {status: request.query.status};
				break;
		}
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
	 * POST issues
	 * Usage:
	 *	 - /api/issues/new -d {
	 * 													title: String,
	 * 													description: String,
	 * 													assignee: String,
	 * 													labels: [],
	 * 													priority: Number,
	 * 													station: String,
	 * 													status: close|open,
	 * 													updated_at: Default = New Date(),
	 * 													due_date: Date,
	 * 													created_at: Default = New Date()
	 * 												}
	 */
	router.post('/api/issues/new', function(request, response) {
		var data = {
			title: request.body.title,
			description: request.body.description,
			assignee: request.body.assignee,
			labels: request.body.labels,
			priority: request.body.priority,
			station: request.body.station,
			status: 'open',
			updated_at: new Date(),
			due_date: request.body.due_date,
			created_at: new Date()
		};
		var issue = new Issue(data);
		issue.save(function(err, data) {
			if (err) {
				response.status(404).send(err);
			} else {
				response.status(200).send(data);
			}
		});
	});

	/**
	 * PUT issues
	 * Usage:
	 *	 - /api/issues/new -d {
	 * 													assignee: String,
	 * 													labels: [],
	 * 													priority: Number,
	 * 													station: String,
	 * 													status: close|open,
	 * 													updated_at: Default = New Date(),
	 * 												}
	 *	 
	 */
	router.put('/api/issues', function(req, res) {
		if(req.body.ids.length > 0) {
			var ids = req.body.ids;
			var update = {};
			var isUpdate = false;

			if (req.body.title) {
				update.title = req.body.title;
				isUpdate = true;
			}
			if (req.body.description) {
				update.description = req.body.description;
				isUpdate = true;
			}
			if (req.body.assignee) {
				update.assignee = req.body.assignee;
				isUpdate = true;
			}

			if (req.body.labels.length > 0) {
				update.labels = req.body.labels;
				isUpdate = true;
			}

			if (req.body.priority) {
				update.priority = req.body.priority;
				isUpdate = true;
			}

			if (req.body.station) {
				update.station = req.body.station;
				isUpdate = true;
			}

			if (req.body.due_date) {
				update.due_date = req.body.due_date;
				isUpdate = true;
			}

			if (req.body.status) {
				update.status = req.body.status;
				isUpdate = true;
			}

			if (isUpdate) {
				update.updated_at = new Date();
			}

			console.log(update);
			Issue.update({_id: {$in: ids.map(function(e){return mongoose.Types.ObjectId(e);}) }}, 
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
	 *	 - /api/sites										[get all sites lat, long, elevation]
	 */
	router.get('/api/sites', function(request, response) {
		Stations.all("SELECT * FROM Sites", function(err, row) {
			if(err) {
				response.status(404).send(err);
				console.log(err);
			} else {
				response.status(200).send(row);
				console.log(row);
			}
		});
	});
};
