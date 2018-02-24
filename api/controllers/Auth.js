//Libraries
var User = require('./../models/users');
var utils = require('./../utils');

module.exports = function(router) {
	router.post('/api/auth', function(req, res) {
		const {email, password} = req.body;
		if (email == "" || email == undefined || 
				password == "" || password == undefined) {
				res.status(200).send({'success': false, 'message': 'Cannot leave email/password empty'});
				return;
		}
		User.find({email: email}, function(err, users) {
			if (err) {
				res.status(200).send({'success': false, message: 'Could not log in. Try again later!'});
			} else {
				if (users.length == 0) {
					res.status(200).send({'success': false, message: 'Oops! No such user.'});
				} else if (users.length == 1) {
					const encrypted_password = utils.saltAndHash(password);
					if (encrypted_password == users[0].password) {
						const {_id, username, first_name, last_name, email} = users[0];
						const result = {
							_id,
							username,
							first_name,
							last_name,
							email,
						};
						res.status(200).send({'success': true, 'data': result});
					} else {
						res.status(200).send({'success': false, 'message': 'Invalid email and/or password.'});
					}
				} else {
					res.status(200).send({'success': false, 'message': 'Duplicate user! Contact administrator.'});
				}
			}
		});
	});

	router.put('/api/auth/create', function(req, res) {
		var data = {
		 email: req.body.email,
		 password: null,
		 update_at: new Date(),
		};
		const random_password = utils.generateRandomPassword();
		data['password'] = utils.saltAndHash(random_password);
		if (data.email == "" || data.email == undefined) {
				res.status(200).send({'success': false, 'message': 'Cannot leave email empty'});
				return;
		}
		User.findOneAndUpdate({email: data.email}, data, function(err, user) {
			if (err) {
				res.status(200).send({'success': false, message: 'Could not generate password for user. Try again later!'});
				return;
			} else {
				console.log("updated user's password", user);
				res.status(200).send({'success': true, message: 'User password generated.', data: random_password});
			}
		});
	});
}
