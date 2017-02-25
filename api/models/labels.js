var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LabelsSchema = new Schema({
	user: String,
	name: String
});
var model = mongoose.model('Labels', LabelsSchema);
module.exports = model;
