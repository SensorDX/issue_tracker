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
var tools = require('./tools');

/**
 * Export API routers
 */
module.exports = function(router) {
	/**
	 * All labels related stuff
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
	router.get('/api/labels', function(request, response) {
		var type = request.query.type;
		var data = [];
		Label.find({$or: [{user: 'admin'}, {user: request.query.user}]}, function(err, labels) {
			if (err) {
				response.status(404).send(err);
			} else {
				switch(type) {
					case 'array':
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
	 * All user related stuff
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
					case 'array':
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
	 * All issues related stuff
	 */
	router.get('/api/issues', function(request, response) {
		var type = request.query.type;
		var status = {};
		switch(request.query.status) {
			case 'all':
				status = {};
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
	router.get('/api/issues/test', function(request, response) {
		Issue.update({_id: '58aa2a3fafe70cc2a47d9400'}, { '$set': {assignee: 'El Roy'}}, false, true);
	});
};
