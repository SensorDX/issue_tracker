var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UsersSchema = new Schema({
	first_name: String,
	last_name: String,
	email: String,
	password: String,
	phone: String,
	stations: [],
	manager: String,
	role: String,
	created_at:  Date,
	update_at: Date,
});
var model = mongoose.model('Users', UsersSchema);
module.exports = model;
