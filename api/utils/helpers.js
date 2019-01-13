//Helper Functions

function getRandomCharIndexFromString(seed) {
	return Math.floor(Math.random()*seed.length);
}

function format_date(mydate, type="") {
	const today = new Date(mydate);
	const year = today.getFullYear();
	const month = today.getMonth();
	const date = today.getDate();
	const hour = today.getHours();
	const minutes = today.getMinutes();
	const seconds = today.getSeconds();
	const milliseconds = today.getMilliseconds();
	switch(type) {
		case 'UTC-milliseconds':
				return Date.UTC(year, month, date, hour, minutes, seconds, milliseconds);
				break;
		default:
				break;
	}
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	const formatted_date = months[month]+ " " + date + ", " + year;
	return formatted_date;
}

function date_diff(first, second) {
	let ms = second.getTime() - first.getTime();	
	let day = (ms/ (1000 * 3600 * 24));
	let hr = (day - Math.floor(day)) * 24;
	let min = (hr - Math.floor(hr)) * 60;
	let sec = (min - Math.floor(min)) * 60;
	day = (day < 1) ? '' : Math.floor(day) + ' days ';
	hr = (hr < 1) ? '' : Math.floor(hr) + ' hr ';
	min = (min < 0) ? '' : Math.floor(min) + ' min ';
	sec = (sec < 1) ? '' : Math.ceil(sec) + ' sec';
	return day + hr + min; 
}

module.exports = {
	getRandomCharIndexFromString,
	format_date,
	date_diff,
}

