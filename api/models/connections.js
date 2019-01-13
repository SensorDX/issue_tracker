var mongoose = require('mongoose');
var opts = {uri_decode_auth: true};

// Issue Tracker DB
var db_1 = 'mongodb://tahmo:7db_p%40%24%24word@ds261570.mlab.com:61570/sensordx-tickets';
var issue_tracker_conn = mongoose.createConnection(db_1, opts, function(
  err,
  response,
) {
  if (err) console.log('Fail to connect to ' + db_1);
  else console.log('Successfully connected to ' + db_1);
});

// Stations Info DB
var db_2 = 'mongodb://tahmo_stations:7db_p%40%24%24word@ds023480.mlab.com:23480/ta_stations';
var sites_conn = mongoose.createConnection(db_2, opts, function(err, response) {
  if (err) console.log('Fail to connect to ' + db_2);
  else console.log('Successfully connected to ' + db_2);
});

// Fault Inbox DB
var fault_inbox_db = '% DB string goes here %';
var fault_inbox_conn = {}; // Your Fault Inbox DB connction code goes her;

module.exports = {
  issue_tracker_conn,
  sites_conn,
  fault_inbox_conn
};
