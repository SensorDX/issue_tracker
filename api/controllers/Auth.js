//Libraries
const User = require('./../models/users');
const {
	generateRandomPassword,
	saltAndHash
}= require('./../utils');

module.exports = function(router) {
 //=====================
 // AUTHENTICATE USER
 //=====================
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
					const encrypted_password = saltAndHash(password);
					if (encrypted_password == users[0].password) {
						const {_id, username, first_name, last_name, email, role} = users[0];
						const result = {
							_id,
							username,
							first_name,
							last_name,
							email,
							role,
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

 //=====================
 // REGISTER USER
 //=====================
	router.put('/api/auth/create', function(req, res) {
		let data = {
		 email: req.body.email,
		 password: null,
		 temp_password: null,
		 updated_at: new Date(),
		};
		if (!req.body.password) {
			const random_password = generateRandomPassword();
			data['password'] = saltAndHash(random_password);
			data['temp_password'] = random_password;
		} else {
			data['password'] = saltAndHash(req.body.password);
			data['temp_password'] = "----";
		}
		if (data.email == "" || data.email == undefined) {
				res.status(200).send({'success': false, 'message': 'Cannot leave email empty'});
				return;
		}
		User.findOneAndUpdate({email: data.email}, data, {new: true}, function(err, user) {
			if (err) {
				res.status(200).send({'success': false, message: 'Could not generate password for user. Try again later!'});
				return;
			} else {
				if (user) {
					res.status(200).send({'success': true, message: 'User password generated.', data: user.temp_password});
				} else {
					res.status(200).send({'success': false, message: 'No such user. Could not generate password. Make sure user exists first'});
				}
			}
		});
	});
}
