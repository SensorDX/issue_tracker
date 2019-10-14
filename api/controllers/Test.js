//Libraries
const {vcap} = require('./../utils');
const env = process.env;
const myTestData = {
  env,
  myService: vcap.getServiceCreds('tahmo-email-config'),
  badService: vcap.getServiceCreds('tahmo-email-configs')
};

module.exports = function(router) {
  router.get('/api/test', function(req, res) {
    res
      .status(200)
      .send({success: true, message: 'My Test Data', data: myTestData});
  });
};
