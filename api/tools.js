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
				console.log('here is milli');
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
				unit: "W/m^2",
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
		//results['data']= []
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
  }
};
