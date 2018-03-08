var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SitesSchema = new Schema({
	SiteCode: String,
	SiteName: String,
	Country: String,
	Elevation_m: Number,
	Latitude: Number,
	Longitude: Number,
});
var model = mongoose.model('Sites', SitesSchema);
module.exports = model;
