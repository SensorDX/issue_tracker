//Libraries
const md5 = require('md5');
const Counter = require('./../models/counters');
const q = require('q');
var fetch = require('node-fetch');
const isoCountries = require('./isoCountries.json');

function getSites() {
  let url = req && req.headers ? req.headers.host : '';
  url += '/api/sites?provider=tahmo&format=siteCodeObj';
  url = 'https://tahmoissuetracker.mybluemix.net/api/sites?provider=tahmo&format=siteCodeObj';
	const deferred = q.defer();
	deferred.resolve(fetch(url, {
			method: 'GET',
		})
	);
	return deferred.promise;
}

const {
	LEFT_SALT, 
	RIGHT_SALT
} = require('./constants');

const {
	getRandomCharIndexFromString,
	format_date,
	date_diff,
} = require('./helpers');

function generateRandomPassword(char_length = 8) {
	const SEED = 'ABCD@!#$%^&*()EFGHIJKLMNO@!#$%^&*()PQRSTUVWXYZ@!#$%^&*()abcdevghijklmnopqrstuvwxyz0123456789@!#$%^&*()';
	let random_password = '';
	let index = '';
	for (let i = 0; i < char_length; ++i) {
		index = getRandomCharIndexFromString(SEED);
		random_password += SEED[index];
	}
	return random_password;
}

function saltAndHash(password) {
	return md5(LEFT_SALT+password+RIGHT_SALT);
}

function modifyIssuesDate(issues, sites, country) {
	results = []
	let items = {};
	issues.map(function(item, index) {
    const site = sites[item.station];
		items = Object.assign(item.toObject(), {
      site: site,
			due_date_formatted: format_date(item.due_date),
			date_updated_formatted: date_diff(item.updated_at, new Date()),
			date_opened_formatted: date_diff(item.created_at, new Date()),
			labels_class: item.labels.map(function(info, i) {
				return info.split(" ").join("-");
			})
		});
		results.push(items);
	});

  if (country) {
    return results.filter(function(el) {
      return el && el.site ? el.site.Country == country : false;
    })
  }
	return results;
}

function modifyCommentsDate(comments) {
	results = []
	let items = {};
	comments.map(function(item, index) {
		items = Object.assign(item.toObject(), {
			date_opened_formatted: date_diff(item.updated_at, new Date()),
		});
		results.push(items);
	});
	return results;
}

function getNextSequence(name) {
	const deferred      = q.defer();
	deferred.resolve(Counter.findByIdAndUpdate(
		{_id: name },
		{$inc: {seq: 1}},
		{new: true}
	));
	return deferred.promise;
}

function geojson (data) {
	var status = ["Active", "Delay", "Closed"];
	var results = {};
	results['features']= []
	data.map(function(item, index) {
		var features = [];
		var randomStatus = status[Math.floor(Math.random() * status.length)];
		var coordinates = [];
		coordinates.push(item.Longitude, item.Latitude, item.Elevation_m);
		var geometry = {
			coordinates: coordinates,
			type: "Point"
		};
		var properties = {
			"Country": "USA",
			"Date of installation": "",
			"Mount height (meters)": item.Elevation_m,
			"Site name": item.SiteName,
			"Station ID": item.SiteCode,
			"Station site type": "",
			"Station status": item.SiteActive ? "Active" : "Closed",
		};
		var items = {
			geometry: geometry,
			properties: properties,
			type: "Feature"
		};
		results['features'].push(items);
	});
	results['type'] = "FeatureCollection";
	return results;
}

function siteCodeObj(data = []) {
  let result = {};
  data.map(function(item, index) {
    result[item.SiteCode] = item;
  });
  return result;
}

function tahmo (data) {
	var results = [];
	let my_data = JSON.parse(JSON.stringify(data));
	my_data.map(function(item, index) {
		var station = {
			"Elevation_m": item.elevation,
			"Latitude": item.location ? item.location.lat : null,
			"Longitude": item.location ? item.location.lng : null,
			"SiteCode": item.id,
			"Country": item.countryCode,
			"DeviceId": item.deviceId,
			"SiteName": item.name,
			"SiteActive": item.active,
		}
		results.push(station);
	});
	return results;
}

function faultInboxHelper() {
  return 'faultInboxHelper() executed';
}

function modifyCountries(countries) {
  let result = [];
  let temp = {};
  for (countryCode in countries) {
    temp['code'] = countryCode;
    temp['name'] = countries[countryCode];
    result.push(temp);
    temp = {};
  }
  return result;
}

module.exports ={
  faultInboxHelper,
	generateRandomPassword,
	saltAndHash,
  modifyCountries,
	modifyCommentsDate,
  modifyIssuesDate,
	getNextSequence,
  getSites,
	geojson,
  isoCountries,
  siteCodeObj,
	tahmo,
  vcap: require('./vcapServices')
}
