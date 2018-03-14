//Libraries
const md5 = require('md5');
const Counter = require('./../models/counters');
const q = require('q');

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

function modifyIssuesDate(issues) {
	results = []
	let items = {};
	issues.map(function(item, index) {
		items = Object.assign(item.toObject(), {
			due_date_formatted: format_date(item.due_date),
			date_updated_formatted: date_diff(item.updated_at, new Date()),
			date_opened_formatted: date_diff(item.created_at, new Date()),
			labels_class: item.labels.map(function(info, i) {
				return info.split(" ").join("-");
			})
		});
		results.push(items);
	});
	console.log(results);
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

module.exports ={
	generateRandomPassword,
	saltAndHash,
  modifyIssuesDate,
	getNextSequence,
}
