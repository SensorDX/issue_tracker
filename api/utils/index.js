//Libraries
var md5 = require('md5');

//Constants
const salt1 = "cDp6eSU[jNT$!U)Y";
const salt2 = "#e(2n9{h{4Am#*{N";

//Helper Functions
function getIndex(seed) {
	return Math.floor(Math.random()*seed.length);
}

module.exports ={
	generateRandomPassword: function (char_length = 8) {
		const SEED = 'ABCD@!#$%^&*()EFGHIJKLMNO@!#$%^&*()PQRSTUVWXYZ@!#$%^&*()abcdevghijklmnopqrstuvwxyz0123456789@!#$%^&*()';
		let random_password = '';
		for (let i = 0; i < char_length; ++i) {
			let index = getIndex(SEED);
			random_password += SEED[index];
		}
		return random_password;
	},
	saltAndHash: function(password) {
		return md5(salt1+password+salt2);
	},
}
