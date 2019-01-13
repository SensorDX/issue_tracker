const {Model1, Model2, Model3} = require('./../models/fault_inbox');
const {faultInboxHelper} = require('./../utils');

module.exports = function(router) {
  //=====================
  // GET FAULT INBOX
  //=====================
  router.get('/api/faultinbox', function(req, res) {
    const helper = faultInboxHelper();
    let model1Data = '';
    let model2Data = '';
    let model3Data = '';

    Model1.findAll(function(result) {
      model1Data = result;
    });

    Model2.findAll(function(result) {
      model2Data = result;
    });

    Model3.findAll(function(result) {
      model3Data = result;
    });
    
    const data = `${helper}. ${model1Data} data, ${model2Data} data, and ${model3Data} data retrieved ...`;

    if (model1Data && model2Data && model3Data) {
        res
          .status(200)
          .send({success: true, data: data});
    } else {
        res
          .status(200)
          .send({success: false, data: 'no data available'});
    }
  });
};
