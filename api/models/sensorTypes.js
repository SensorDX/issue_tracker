var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SensorTypesSchema = new Schema({
	name: String,
	description: String,
	notes: String
});
var model = mongoose.model('sensor_types', SensorTypesSchema);
module.exports = model;
