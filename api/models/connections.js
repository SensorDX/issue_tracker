var mongoose = require('mongoose');
var opts = {uri_decode_auth: true};
//TODO: Revert back to the right db_1
var db_1 = "mongodb://tahmo:7db_p%40%24%24word@ds261570.mlab.com:61570/sensordx-tickets";
var db_2 = "mongodb://tahmo_stations:7db_p%40%24%24word@ds023480.mlab.com:23480/ta_stations";
//var db_1 = "mongodb://sensordx:helloworld@ds161049.mlab.com:61049/issue_tracker";
//var db_2 = "mongodb://tahmo_stations:7db_p%40%24%24word@ds023480.mlab.com:23480/ta_stations";
var issue_tracker_conn = mongoose.createConnection(db_1, opts, function(err, response) {
	if (err)
		console.log('Fail to connect to '+ db_1);
	else
		console.log('Successfully connected to '+ db_1);
});
var sites_conn = mongoose.createConnection(db_2, opts, function(err, response) {
 if (err)
	console.log('Fail to connect to '+ db_2);
 else
	console.log('Successfully connected to '+ db_2);
});
module.exports = {
	issue_tracker_conn,
	sites_conn,
}
