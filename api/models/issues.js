var {issue_tracker_conn} = require('./connections');
var mongoose = require('mongoose');
var IssuesSchema = new mongoose.Schema({
	ticket_id: String,
	title: String,
	description: String,
	opened_by: {},
	closed_by: {},
	assignee: {},
	comments: [],
	labels: [],
	priority: String,
	station: String,
	deviceId: String,
	status: String,
	due_date: Date,
	updated_at: Date,
	created_at: Date
});
var model = issue_tracker_conn.model('Issues', IssuesSchema);
module.exports = model;
