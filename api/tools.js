// tools.js
// ========
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
				due_date: item.due_date,
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
