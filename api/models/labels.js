var {issue_tracker_conn} = require('./connections');
var mongoose = require('mongoose');
var LabelsSchema = new mongoose.Schema({
	user: String,
	name: String
});
var model = issue_tracker_conn.model('Labels', LabelsSchema);
module.exports = model;
