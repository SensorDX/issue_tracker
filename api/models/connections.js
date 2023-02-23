var variables = JSON.parse(process.env.VCAP_SERVICES || '{}')
var db_1 = process.env.DB_1;
var db_2 = process.env.DB_2;
console.log('variables', variables);
var mongoose = require('mongoose');
// var opts = {uri_decode_auth: true};
var opts = {useNewUrlParser: true, useUnifiedTopology: true};

// Issue Tracker DB
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
const { promisify } = require('util');
const setTimeoutPromise = promisify(setTimeout);

async function connectToDatabase(db_url) {
  try {
    await mongoose.connect(db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,     
    });

    console.log('Successfully connected to ' + db_url);

    // Listen for disconnection event
    mongoose.connection.on('disconnected', async () => {
      console.log('Lost connection to MongoDB');

      try {
        await setTimeoutPromise(60000); // wait for 1 minute before attempting to reconnect

        await mongoose.connect(db_url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,         
        });

        console.log('Successfully reconnected to ' + db_url);
        
      } catch (error) {
        console.error('Error reconnecting to ' + db_url + ':', error.message);
        process.exit(1); // Exit the process with a non-zero exit code to restart the application on failed reconnection
      }
    });

    // Listen for reconnected event and log message
    mongoose.connection.on('reconnected', () => {
      console.log('Successfully reconnected to MongoDB');
    });
  } catch (error) {
    console.error('Error connecting to ' + db_url + ':', error.message);
    process.exit(1); // Exit the process with a non-zero exit code to restart the application
  }
}

connectToDatabase(db_1);
connectToDatabase(db_2);
///////////////////////////////////////////////////////

// Fault Inbox DB
var fault_inbox_db = '% DB string goes here %';
var fault_inbox_conn = {}; // Your Fault Inbox DB connction code goes her;

module.exports = {
  issue_tracker_conn,
  sites_conn,
  fault_inbox_conn
};
