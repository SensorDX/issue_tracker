var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentsSchema = new Schema({
	message: String,
	picture: String,
	created_by: {},
	updated_at: Date,
	created_at: Date
});
var model = mongoose.model('Comments', CommentsSchema);
module.exports = model;
