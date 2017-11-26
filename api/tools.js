// tools.js
// ========
var format_date = function(mydate, type="") {
	var today = new Date(mydate);
	var year = today.getFullYear();
	var month = today.getMonth();
	var date = today.getDate();
	var hour = today.getHours();
	var minutes = today.getMinutes();
	var seconds = today.getSeconds();
	var milliseconds = today.getMilliseconds();
	switch(type) {
		case 'UTC-milliseconds':
				//console.log('here is milli');
				return Date.UTC(year, month, date, hour, minutes, seconds, milliseconds);
				break;
		default:
				break;
	}
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	var formatted_date = months[month]+ " " + date + ", " + year;
	return formatted_date;
}
var QFlagInfo = function (flag_number) {
	switch (flag_number) {
		case 0:
			return "good data";
			break;
		case 1:
			return "suspect data";
			break;
		case 2:
			return "warning data";
			break;
		case 3:
			return "failure data";
			break;
		case 4:
			return "sensor temporarily missing";
			break;
		case 8:
			return "sensor not installed at this location";
			break;
		case -9:
			return "data not available";
			break;
		default:
			return "data not available";
			break;
	}
}
var date_diff = function(first, second) {
	var ms = second.getTime() - first.getTime();	
	var day = (ms/ (1000 * 3600 * 24));
	var hr = (day - Math.floor(day)) * 24;
	var min = (hr - Math.floor(hr)) * 60;
	var sec = (min - Math.floor(min)) * 60;
	day = (day < 1) ? '' : Math.floor(day) + ' days ';
	hr = (hr < 1) ? '' : Math.floor(hr) + ' hr ';
	min = (min < 0) ? '' : Math.floor(min) + ' min ';
	sec = (sec < 1) ? '' : Math.ceil(sec) + ' sec';
	return day + hr + min; 
}
module.exports = {
  label: function (labels) {
		var results = [];
		labels.map(function(item, index) {
			results.push({name: item.name});
		});
		return results;
  },
  assignee: function (users) {
		var results = [];
		users.map(function(item, index) {
			var full_name = item.first_name + ' ' + item.last_name;
			results.push({name: full_name});
		});
		return results;
  },
  sensorify: function (data) {
		var status = ["Active", "Delay", "Closed"];
		var results = {};
		results['data']= []
		data.map(function(item, index) {
			var temperature = {
				name: "Temperature",
				icon: "temperature.svg",
				time_stamp: item.DateTimeUTC,
				reading: item.TAIR,
				unit: "&#8451;",
				QFlag: item.QTAIR,
				QFlagText: QFlagInfo(item.QTAIR)
			};
			var relative_humidity = {
				name: "Relative Humidity",
				icon: "relative_humidity.svg",
				time_stamp: item.DateTimeUTC,
				reading: item.RELH,
				unit: "%",
				QFlag: item.QRELH,
				QFlagText: QFlagInfo(item.QRELH)
			};
			var pressure = {
				name: "Pressure",
				icon: "pressure.svg",
				time_stamp: item.DateTimeUTC,
				reading: item.PRES,
				unit: "mbar",
				QFlag: item.QPRES,
				QFlagText: QFlagInfo(item.QPRES)
			};
			var precipitation = {
				name: "Precipitation",
				icon: "precipitation.svg",
				time_stamp: item.DateTimeUTC,
				reading: item.RAIN,
				unit: "mm",
				QFlag: item.QRAIN,
				QFlagText: QFlagInfo(item.QRAIN)
			};
			var radiation = {
				name: "Radiation",
				icon: "radiation.svg",
				time_stamp: item.DateTimeUTC,
				reading: item.SRAD,
				unit: "W/m^2",
				QFlag: item.QSRAD,
				QFlagText: QFlagInfo(item.QSRAD)
			};
			var windspeed = {
				name: "Wind",
				icon: "wind.svg",
				time_stamp: item.DateTimeUTC,
				reading: item.WSPD,
				unit: "m/s",
				QFlag: item.QWSPD,
				QFlagText: QFlagInfo(item.QWSPD)
			};
			results['data'].push(temperature, relative_humidity, pressure, precipitation, radiation, windspeed);
			results['BATV'] = item.BATV;
		});
		console.log(results);
		return results;
  },
  prepareGraphData: function (data, sensor) {
		var results = [];
		data.map(function(item, index) {
			var point = [];
			var timestamp = format_date(item.DateTimeUTC, "UTC-milliseconds");
			console.log('time stamp');
			console.log(timestamp);
			point.push(timestamp);
			point.push(item[sensor]);
			results.push(point);
		});
		console.log(results);
		return results;
  },
  geojson: function (data) {
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
				"Station status": randomStatus,
			};
			var items = {
				geometry: geometry,
				properties: properties,
				type: "Feature"
			};
			results['features'].push(items);
		});
		results['type'] = "FeatureCollection";
		console.log(results);
		return results;
  },
  sensorifyTahmo: function (data) {
		var status = ["Active", "Delay", "Closed"];
		var results = {};
		results['data']= []
		/*
		data.map(function(item, index) {
			var temperature = {
				name: "Temperature",
				icon: "temperature.svg",
				time_stamp: item.DateTimeUTC,
				reading: item.TAIR,
				unit: "&#8451;",
				QFlag: item.QTAIR,
				QFlagText: QFlagInfo(item.QTAIR)
			};
			var relative_humidity = {
				name: "Relative Humidity",
				icon: "relative_humidity.svg",
				time_stamp: item.DateTimeUTC,
				reading: item.RELH,
				unit: "%",
				QFlag: item.QRELH,
				QFlagText: QFlagInfo(item.QRELH)
			};
			var pressure = {
				name: "Pressure",
				icon: "pressure.svg",
				time_stamp: item.DateTimeUTC,
				reading: item.PRES,
				unit: "mbar",
				QFlag: item.QPRES,
				QFlagText: QFlagInfo(item.QPRES)
			};
			var precipitation = {
				name: "Precipitation",
				icon: "precipitation.svg",
				time_stamp: item.DateTimeUTC,
				reading: item.RAIN,
				unit: "mm",
				QFlag: item.QRAIN,
				QFlagText: QFlagInfo(item.QRAIN)
			};
			var radiation = {
				name: "Radiation",
				icon: "radiation.svg",
				time_stamp: item.DateTimeUTC,
				reading: item.SRAD,
				unit: "W/m^2",
				QFlag: item.QSRAD,
				QFlagText: QFlagInfo(item.QSRAD)
			};
			var windspeed = {
				name: "Wind",
				icon: "wind.svg",
				time_stamp: item.DateTimeUTC,
				reading: item.WSPD,
				unit: "m/s",
				QFlag: item.QWSPD,
				QFlagText: QFlagInfo(item.QWSPD)
			};
			results['data'].push(temperature, relative_humidity, pressure, precipitation, radiation, windspeed);
			results['BATV'] = item.BATV;
		});
		*/
		console.log(results);
		return results;
  },
  prepareTahmoGraphData: function (data, sensor) {
		console.log('now preparing '+sensor);
		var sensor_map = {};
		sensor_map['SRAD'] = 'radiation';
		sensor_map['RAIN'] = 'precipitation';
		sensor_map['WSP'] = 'windspeed';
		sensor_map['TAIR'] = 'temperature';
		sensor_map['RELH'] = 'relevativehumidity';
		sensor_map['PRES'] = 'atmosphericpressure';
		console.log(sensor_map);
		var results = [];
		console.log('sensor_map', sensor_map[sensor]);
		var obj = data['timeseries'][sensor_map[sensor]];
		//var obj = data['timeseries'][sensor_map[sensor]];
		//console.log('my obj', obj);
		for (key in obj) {
			var point = [];
			var timestamp = format_date(key, "UTC-milliseconds");
			//console.log('time stamp');
			//console.log(timestamp);
			point.push(timestamp);
			point.push(obj[key]);
			results.push(point);
		}
		//console.log(results);
		return results;
  },
  tahmoGeojson: function (data) {
		var status = ["Active", "Delay", "Closed"];
		var results = {};
		results['features']= []
		data['stations'].map(function(item, index) {
			var features = [];
			var randomStatus = status[Math.floor(Math.random() * status.length)];
			var coordinates = [];
			coordinates.push(item.location.lng, item.location.lat, item.elevation);
			var geometry = {
				coordinates: coordinates,
				type: "Point"
			};
			var properties = {
				"Country": item.countryCode,
				"Date of installation": "",
				"Mount height (meters)": item.elevation,
				"Site name": item.name,
				"Station ID": item.id,
				"Station site type": "",
				"Station status": item.active ? "Active" : "Closed",
			};
			var items = {
				geometry: geometry,
				properties: properties,
				type: "Feature"
			};
			results['features'].push(items);
		});
		results['type'] = "FeatureCollection";
		console.log(results);
		return results;
  },
  modify: function (issues) {
		var results = {};
		results['data']= []
		var current = new Date();
		var count = 0;
		issues.map(function(item, index) {
			var items = {
				_id: item._id,
				title: item.title,
				description: item.description,
				status: item.status,
				priority: item.priority,
				station: item.station,
				due_date: format_date(item.due_date),
				date_updated: date_diff(item.updated_at, current),
				date_opened: date_diff(item.created_at, current),
				assignee: item.assignee,
				labels: item.labels,
				labels_class: item.labels.map(function(info, i) {
					return info.split(" ").join("-");
				})
			};
			results['data'].push(items);
			count++;
		});
		results['count'] = count;
		console.log(results.data);
		return results;
  },
  modifyDate: function (stations) {
		var results = {};
		results['data']= []
		var current = new Date();
		var sensors = ["TAIR", "RELH", "PRES", "RAIN", "SRAD", "WSPD"]
		var managers = ["Rene Midouin", "Jesus Christ", "Rene Descartes", "Jon Snow", "Isaac Newton"]
		stations.map(function(item, index) {
			var randomManager = managers[Math.floor(Math.random() * managers.length)];
			var items = {
				_id: item._id,
				Elevation_m: item.Elevation_m,
				Latitude: item.Latitude,
				Longitude: item.Longitude,
				SiteCode: item.SiteCode,
				SiteID: item.SiteID,
				SiteName: item.SiteName,
				Manager: randomManager,
				Sensors: sensors,
				date_created: current
			};
			results['data'].push(items);
		});
		console.log(results.data);
		return results['data'];
  },
  manage: function (stations) {
		var results = {};
		results['data']= []
		var current = new Date();
		stations.map(function(item, index) {
			var items = {
				_id: item._id,
				Elevation_m: item.Elevation_m,
				Location: item.Latitude+", "+item.Longitude,
				Latitude: item.Latitude,
				Longitude: item.Longitude,
				SiteCode: item.SiteCode,
				SiteID: item.SiteID,
				SiteName: item.SiteName,
				Manager: item.Manager,
				Sensors: item.Sensors,
				NumSensors: item.Sensors.length,
				date_created: current
			};
			results['data'].push(items);
		});
		console.log(results.data);
		return results;
  }
};
