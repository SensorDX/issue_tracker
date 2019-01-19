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
  let month = day / 30;
  let year = month / 12;
	let hr = (day - Math.floor(day)) * 24;
	let min = (hr - Math.floor(hr)) * 60;
	let sec = (min - Math.floor(min)) * 60;

  const yearUnit = (Math.floor(year) == 1) ? ' year ' : ' years ';
  const monthUnit = (Math.floor(month) == 1) ? ' month ' : ' months ';
  const dayUnit = (Math.floor(day) == 1) ? ' day ' : ' days ';
  const hourUnit = (Math.floor(hr) == 1) ? ' hour ' : ' hours ';
  const minuteUnit = (Math.floor(min) == 1) ? ' minute ' : ' minutes ';
  const secondUnit = (Math.floor(sec) == 1) ? ' second ' : ' seconds ';

  if (year >= 1) return Math.floor(year) + yearUnit;
  if (month >= 1) return Math.floor(month) + monthUnit;
  if (day >= 1) return Math.floor(day) + dayUnit;

	day = (day < 1) ? '' : Math.floor(day) + dayUnit;
	hr = (hr < 1) ? '' : Math.floor(hr) + hourUnit;
	min = (min < 0) ? '' : Math.floor(min) + minuteUnit;
	sec = (sec < 1) ? '' : Math.ceil(sec) + secondUnit;

  return hr + min; 
}

module.exports = {
	getRandomCharIndexFromString,
	format_date,
	date_diff,
}

