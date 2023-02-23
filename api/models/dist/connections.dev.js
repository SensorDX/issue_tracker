"use strict";

var variables = JSON.parse(process.env.VCAP_SERVICES || '{}');
var db_1 = process.env.DB_1;
var db_2 = process.env.DB_2;
console.log('variables', variables);

var mongoose = require('mongoose'); // var opts = {uri_decode_auth: true};


var opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}; // Issue Tracker DB
// var issue_tracker_conn = mongoose.createConnection(db_1, opts, function(
//   err,
//   response
// ) {
//   if (err) console.log('Fail to connect to ' + db_1);
//   else console.log('Successfully connected to ' + db_1);
// });
// // Stations Info DB
// var sites_conn = mongoose.createConnection(db_2, opts, function(err, response) {
//   if (err) console.log('Fail to connect to ' + db_2);
//   else console.log('Successfully connected to ' + db_2);
// });
/////////////////////////////////////////////////////////
//////including more db reconnection error handling update
/////////////////////////////////////////////////////////
//const mongoose = require('mongoose');

var _require = require('util'),
    promisify = _require.promisify;

var setTimeoutPromise = promisify(setTimeout);

function connectToDatabase(db_url) {
  return regeneratorRuntime.async(function connectToDatabase$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }));

        case 3:
          console.log('Successfully connected to ' + db_url); // Listen for disconnection event

          mongoose.connection.on('disconnected', function _callee() {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    console.log('Lost connection to MongoDB');
                    _context.prev = 1;
                    _context.next = 4;
                    return regeneratorRuntime.awrap(setTimeoutPromise(60000));

                  case 4:
                    _context.next = 6;
                    return regeneratorRuntime.awrap(mongoose.connect(db_url, {
                      useNewUrlParser: true,
                      useUnifiedTopology: true
                    }));

                  case 6:
                    console.log('Successfully reconnected to ' + db_url);
                    _context.next = 13;
                    break;

                  case 9:
                    _context.prev = 9;
                    _context.t0 = _context["catch"](1);
                    console.error('Error reconnecting to ' + db_url + ':', _context.t0.message);
                    process.exit(1); // Exit the process with a non-zero exit code to restart the application on failed reconnection

                  case 13:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[1, 9]]);
          }); // Listen for reconnected event and log message

          mongoose.connection.on('reconnected', function () {
            console.log('Successfully reconnected to MongoDB');
          });
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error('Error connecting to ' + db_url + ':', _context2.t0.message);
          process.exit(1); // Exit the process with a non-zero exit code to restart the application

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

connectToDatabase(db_1);
connectToDatabase(db_2); ///////////////////////////////////////////////////////
// Fault Inbox DB

var fault_inbox_db = '% DB string goes here %';
var fault_inbox_conn = {}; // Your Fault Inbox DB connction code goes her;

module.exports = {
  issue_tracker_conn: issue_tracker_conn,
  sites_conn: sites_conn,
  fault_inbox_conn: fault_inbox_conn
};
//# sourceMappingURL=connections.dev.js.map
