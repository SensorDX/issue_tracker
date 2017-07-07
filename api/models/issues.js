var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var IssuesSchema = new Schema({
	title: String,
	description: String,
	assignee: String,
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
