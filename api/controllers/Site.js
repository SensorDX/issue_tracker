//Libraries
const Site = require('./../models/sites');
const {geojson}= require('./../utils');

module.exports = function(router) {
 //=====================
 // GET SITES
 //=====================
 router.get('/api/sites', function(req, res) {
	const {format} = req.query;
  Site.find({}, function(err, sites) {
   if (err) {
		res.status(200).send({success: false, message: 'Could not retrieve sites.'});
   } else {
		let data = [];
		switch (format) {
			case 'geojson':
				data = geojson(sites);
				break;
			default:
				data = sites;
				break;
		}
		res.status(200).send({success: true, message: 'Sites retrieved successfully.', data: data});
   }
  });
 });

 //=====================
 // GET SITES BY SITECODE
 //=====================
 router.get('/api/sites/:sitecode', function(req, res) {
  const {sitecode} = req.params;
  Site.find({SiteCode: sitecode}, function(err, site) {
   if (err) {
		res.status(200).send({success: false, message: 'Could not retrieve the specified site.'});
   } else {
		res.status(200).send({success: true, message: 'Site retrieved successfully.', data: site[0]});
   }
  });
 });

}
