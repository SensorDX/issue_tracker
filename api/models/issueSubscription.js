var {issue_tracker_conn} = require('./connections');
var mongoose = require('mongoose');
var IssueSubscriptionSchema = new mongoose.Schema({
	user_id: String,
	issue_id: String,
});
var model = issue_tracker_conn.model('IssueSubscriptions', IssueSubscriptionSchema);
module.exports = model;
