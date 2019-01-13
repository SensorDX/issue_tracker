var {issue_tracker_conn} = require('./connections');
var mongoose = require('mongoose');
var CommentsSchema = new mongoose.Schema({
	message: String,
	picture: String,
	created_by: {},
	updated_at: Date,
	created_at: Date
});
var model = issue_tracker_conn.model('Comments', CommentsSchema);
module.exports = model;
