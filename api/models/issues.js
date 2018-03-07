var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var IssuesSchema = new Schema({
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
	status: String,
	due_date: Date,
	updated_at: Date,
	created_at: Date
});
var model = mongoose.model('Issues', IssuesSchema);
module.exports = model;
