var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CountersSchema = new Schema({
	_id: String,
	seq: { type: Number, default: 0 },
});
var model = mongoose.model('Counters', CountersSchema);
module.exports = model;
