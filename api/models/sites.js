var {sites_conn} = require('./connections');
var mongoose = require('mongoose');
var SitesSchema = new mongoose.Schema({
	SiteCode: String,
	SiteName: String,
	Country: String,
	Elevation_m: Number,
	Latitude: Number,
	Longitude: Number,
});
var model = sites_conn.model('Stations', SitesSchema);
module.exports = model;
