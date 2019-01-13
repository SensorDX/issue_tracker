var {issue_tracker_conn} = require('./connections');
var mongoose = require('mongoose');
var CountersSchema = new mongoose.Schema({
	_id: String,
	seq: { type: Number, default: 0 },
});
var model = issue_tracker_conn.model('Counters', CountersSchema);
module.exports = model;
