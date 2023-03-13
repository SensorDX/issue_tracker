//option one -- faster than option 2

var variables = JSON.parse(process.env.VCAP_SERVICES || '{}')
var db_1 = process.env.DB_1;
var db_2 = process.env.DB_2;
console.log('variables', variables);
var mongoose = require('mongoose');
var opts = {useNewUrlParser: true, useUnifiedTopology: true};

// Issue Tracker DB
var issue_tracker_conn = mongoose.createConnection(db_1, opts, function(
  err,
  response
) {
  if (err) {
    console.log('Fail to connect to ' + db_1);
  }
  else {
    console.log('Successfully connected to ' + db_1);

    // Handle database disconnection
    issue_tracker_conn.on('disconnected', function() {
      console.log('Lost connection to Issue Tracker DB');
      setTimeout(function() {
        process.exit(1); // return non-zero to restart application
      }, 120000); // wait for 2 minutes before returning non-zero exit code
    });
  }
});

// Stations Info DB
var sites_conn = mongoose.createConnection(db_2, opts, function(err, response) {
  if (err) {
    console.log('Fail to connect to ' + db_2);
  }
  else {
    console.log('Successfully connected to ' + db_2);

    // Handle database disconnection
    sites_conn.on('disconnected', function() {
      console.log('Lost connection to Stations Info DB');
      setTimeout(function() {
        process.exit(1); // return non-zero to restart application
      }, 120000); // wait for 2 minutes before returning non-zero exit code
    });
  }
});

// Fault Inbox DB
var fault_inbox_db = '% DB string goes here %';
var fault_inbox_conn = {}; // Your Fault Inbox DB connction code goes here;

module.exports = {
  issue_tracker_conn,
  sites_conn,
  fault_inbox_conn
}; 


//option two -- slower than option one
/* 
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
  if (err) {
    console.log('Fail to connect to ' + db_1);
  }
  else {
    console.log('Successfully connected to ' + db_1);

    // Handle database disconnection
    issue_tracker_conn.on('disconnected', function() {
      console.log('Lost connection to Issue Tracker DB');
      var intervalId = setInterval(function() {
        if (issue_tracker_conn.readyState === 0) {
          console.log('Issue Tracker DB disconnected again. Attempting to reconnect...');
          issue_tracker_conn.open(db_1, opts);
        }
      }, 5000); // Check every 5 seconds

      // Stop checking for disconnection after 2 minutes
      setTimeout(function() {
        clearInterval(intervalId);
        console.log('Stopped checking for disconnection from Issue Tracker DB');
        process.exit(1); // return non-zero to restart application
      }, 120000); // Wait for 2 minutes before returning non-zero exit code
    });
  }
});

// Stations Info DB
var sites_conn = mongoose.createConnection(db_2, opts, function(err, response) {
  if (err) {
    console.log('Fail to connect to ' + db_2);
  }
  else {
    console.log('Successfully connected to ' + db_2);

    // Handle database disconnection
    sites_conn.on('disconnected', function() {
      console.log('Lost connection to Stations Info DB');
      var intervalId = setInterval(function() {
        if (sites_conn.readyState === 0) {
          console.log('Stations Info DB disconnected again. Attempting to reconnect...');
          sites_conn.open(db_2, opts);
        }
      }, 5000); // Check every 5 seconds

      // Stop checking for disconnection after 2 minutes
      setTimeout(function() {
        clearInterval(intervalId);
        console.log('Stopped checking for disconnection from Stations Info DB');
        process.exit(1); // return non-zero to restart application
      }, 120000); // Wait for 2 minutes before returning non-zero exit code
    });
  }
});

// Fault Inbox DB
var fault_inbox_db = '% DB string goes here %';
var fault_inbox_conn = {}; // Your Fault Inbox DB connction code goes here;

module.exports = {
  issue_tracker_conn,
  sites_conn,
  fault_inbox_conn
};
 */


//Original code

/* var variables = JSON.parse(process.env.VCAP_SERVICES || '{}')
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
}; */
