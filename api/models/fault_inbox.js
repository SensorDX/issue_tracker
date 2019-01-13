// 1.- Create a connectiong in 'connections.js'
// 2.- Import connection from 'connections.js'
// 3.- Export db model here
//
// Note: See other models for example
var {fault_inbox_conn} = require('./connections');
// Define your first model
const Model1 = {
  findAll: function(cb) {
    cb('Model1');
  }
}
// Define your second model
const Model2 = {
  findAll: function(cb) {
    cb('Model2');
  }
}
// Define all other models
const Model3 = {
  findAll: function(cb) {
    cb('Model3');
  }
}
// Export all models
//
// Note: You can create a folder for 'fault_inbox' instead and organize your
// models there instead of writing all of your models in one file
module.exports = {
  Model1,
  Model2,
  Model3
};
