//Libraries
const Site = require('./../models/sites');
const {geojson, siteCodeObj, tahmo}= require('./../utils');
var fetch = require('node-fetch');

module.exports = function(router) {
 //=====================
 // GET SITES
 //=====================
 router.get('/api/sites', function(req, res) {
	const {auth_type, format, provider} = req.query;
	if (provider) {
		let url = null;
		let username = null;
		let password = null;
		let headers = null;
		switch (provider) {
			case 'tahmo':
				url = "https://tahmoapi.mybluemix.net/v1/stations";
				username = "6WYHYT0XVY7BXZHXN7HBKYAZ8";
				password = "Rk7pZpdJ0gwxHVGr3kpbpHX6p8fk2+pJhhKAx2Nr77I";
				break;
			default: 
				break;
		}
		switch (auth_type) {
			case 'basic':
				headers = {'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')};
				break;
			default:
				headers = {'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')};
				break;
		}
		fetch(url, {
			method: 'GET',
			headers: headers,
		})
		.then(function(res) {
			return res.json();
		})
		.then(function(json) {
			data = json['stations'];
			switch(format) {
			 case 'geojson':
				data = geojson(tahmo(data));
				break;
			 case 'raw':
				break;
       case 'siteCodeObj':
				data = siteCodeObj(tahmo(data));
        break;
			 default:
				data = tahmo(data);
				break;
			}
			res.status(200).send({success: true, message: 'Sites retrieved successfully.', data: data});
		})
		.catch(function(err) {
			res.status(200).send({success: false, message: 'Could not retrieve sites.'});
		});
	} else {
		Site.find({}, function(err, sites) {
		 if (err) {
			res.status(200).send({success: false, message: 'Could not retrieve sites.'});
		 } else {
			let data = [];
			switch (format) {
				case 'geojson':
					data = geojson(tahmo(sites));
					break;
				default:
					data = tahmo(sites);
					break;
			}
			res.status(200).send({success: true, message: 'Sites retrieved successfully.', data: data});
		 }
		});
	}
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
