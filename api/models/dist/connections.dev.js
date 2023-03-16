"use strict";

//option two
var variables = JSON.parse(process.env.VCAP_SERVICES || '{}');
var db_1 = process.env.DB_1;
var db_2 = process.env.DB_2;

var mongoose = require('mongoose');

var opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}; // Issue Tracker DB

var issue_tracker_conn = mongoose.createConnection(db_1, opts, function (err, response) {
  if (err) {
    console.log('Fail to connect to ' + db_1);
  } else {
    console.log('Successfully connected to ' + db_1); // Handle database disconnection

    issue_tracker_conn.on('disconnected', function () {
      console.log('Lost connection to Issue Tracker DB');
      reconnect(issue_tracker_conn, db_1, opts);
    });
  }
}); // Stations Info DB

var sites_conn = mongoose.createConnection(db_2, opts, function (err, response) {
  if (err) {
    console.log('Fail to connect to ' + db_2);
  } else {
    console.log('Successfully connected to ' + db_2); // Handle database disconnection

    sites_conn.on('disconnected', function () {
      console.log('Lost connection to Stations Info DB');
      reconnect(sites_conn, db_2, opts);
    });
  }
}); // Fault Inbox DB

var fault_inbox_db = '% DB string goes here %';
var fault_inbox_conn = {}; // Your Fault Inbox DB connction code goes here;

function reconnect(conn, dbUrl, opts) {
  var attemptNum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  if (attemptNum > 10) {
    console.log('Failed to reconnect to ' + dbUrl + ' after 10 attempts');
    setTimeout(function () {
      process.exit(1); // return non-zero to restart application
    }, 240000); // wait for 4 minutes before returning non-zero exit code

    return;
  }

  console.log('Attempting to reconnect to ' + dbUrl + ', attempt #' + attemptNum); //mongoose.disconnect(); //conn.open() throws an error

  setTimeout(function () {
    mongoose.createConnection(dbUrl, opts, function (err) {
      if (err) {
        console.log('Reconnect attempt #' + attemptNum + ' to ' + dbUrl + ' failed');
        reconnect(conn, dbUrl, opts, attemptNum + 1);
      } else {
        console.log('Reconnected to ' + dbUrl + ' successfully');
      }
    });
  }, 10000); // wait 10 seconds before each reconnection attempt
}

module.exports = {
  issue_tracker_conn: issue_tracker_conn,
  sites_conn: sites_conn,
  fault_inbox_conn: fault_inbox_conn
}; //option one

/*
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
//# sourceMappingURL=connections.dev.js.map
