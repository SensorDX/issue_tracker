var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UsersSchema = new Schema({
	username: String,
	first_name: String,
	last_name: String,
	email: String,
	password: String,
	projects: [],
	created_at:  String

});
var model = mongoose.model('Users', UsersSchema);
module.exports = model;
