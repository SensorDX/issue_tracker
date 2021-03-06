var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StationsSchema = new Schema({
	SiteCode: String,
	SiteName: String,
	Latitude: Number,
	Longitude: Number,
	Elevation_m: Number,
	Sensors: Array,
	Manager: String,
	date_created: Date
});
var model = mongoose.model('Stations', StationsSchema);
module.exports = model;
