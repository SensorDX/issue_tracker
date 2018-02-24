var User = require('./../models/users');
const salt1 = "cDp6eSU[jNT$!U)Y";
const salt2 = "#e(2n9{h{4Am#*{N";
var md5 = require('md5');
module.exports = function(router) {
	/**
	 * CREATE A USER
	 */
	router.post('/api/users', function(req, res) {
		var data = {
		 first_name: req.body.first_name,
		 last_name: req.body.last_name,
		 email: req.body.email,
		 password: req.body.password,
		 stations: req.body.stations || [],
		 manager: req.body.manager || '',
		 phone: req.body.phone || '',
		 role: req.body.role || 'agent',
		 created_at: new Date(),
		 update_at: new Date(),
		};
		if (data.email == "" || data.email == undefined || 
				data.password == "" || data.password == undefined) {
				res.status(200).send({success: false, message: 'Cannot leave email/password empty'});
				return;
		}
		if (data.first_name == "" || data.first_name == undefined || 
				data.last_name == "" || data.last_name == undefined) {
				res.status(200).send({success: false, message: 'Cannot leave first_name/last_name empty'});
				return;
		}
		if (data.role == "" || data.role == undefined) {
				res.status(200).send({success: false, message: 'Cannot leave user role empty'});
				return;
		}
		User.find({email: data.email}, function(err, users) {
			if (err) {
				res.status(200).send({success: false, message: 'Could not create user. Try again later!'});
				return;
			} else {
				if (users.length > 0) {
					res.status(200).send({success: false, message: 'Oops! User with same email address already exists.'});
					return;
				} else {
					const encrypted_password = md5(salt1+data['password']+salt2);
					data['password'] = encrypted_password;
					var user = new User(data);
					user.save(function(err, data) {
					 if (err) {
						 res.status(200).send({success: false, message: 'Could not create user. Try again later!'});
					 } else {
						 res.status(200).send({success: true, message: "New user created", data: data});
					 }
					});
				}
			}
		});
	});
}
