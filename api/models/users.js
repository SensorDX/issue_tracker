var {issue_tracker_conn} = require('./connections');
var mongoose = require('mongoose');
var UsersSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	full_name: String,
	email: String,
	password: String,
	temp_password: String,
	phone: String,
	stations: [],
	manager: String,
	role: String,
	created_at:  Date,
	updated_at: Date,
});
var model = issue_tracker_conn.model('Users', UsersSchema);
module.exports = model;
