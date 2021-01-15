var variables = JSON.parse(process.env.VCAP_SERVICES || '{}')
var db_1 = process.env.DB_1;
var db_2 = process.env.DB_2;
console.log('variables', variables);
var mongoose = require('mongoose');
// var opts = {uri_decode_auth: true};
var opts = {useNewUrlParser: true, useUnifiedTopology: true};

// Issue Tracker DB
var issue_tracker_conn = mongoose.createConnection(db_1, opts, function(
  err,
  response
) {
  if (err) console.log('Fail to connect to ' + db_1);
  else console.log('Successfully connected to ' + db_1);
});

// Stations Info DB
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
