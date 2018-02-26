//Libraries
var Issue = require('./../models/issues');
var utils = require('./../utils');

module.exports = function(router) {
 /**
	* GET USERS
	*/
 router.get('/api/users', function(req, res) {
  const {role} = req.query;
	let query = {};
	if (role) {
		query = {role};
	}
  User.find(query, {password: 0}, function(err, users) {
   if (err) {
		res.status(200).send({success: false, message: 'Cannot get users.'});
   } else {
		console.log('users retrieved', users);
		res.status(200).send({success: true, message: 'Users retrieved.', data: users});
   }
  });
 });

 /**
	* GET USER BY ID
	*/
 router.get('/api/users/:id/:field?', function(req, res) {
	const {id, field} = req.params;
	let query = {};
	switch (field) {
		case 'managing':
			query = {manager: id};
			break;
		default:
			break;
	}
	if (field) {
		User.find(query, {password: 0}, function(err, users) {
		 if (err) {
			res.status(200).send({success: false, message: "Cannot get manager's users."});
		 } else {
			console.log("manager's users retrieved", users);
			res.status(200).send({success: true, message: "Manager's users retrieved.", data: users});
		 }
		});
	} else {
		User.findById(id, {password: 0}, function(err, user) {
		 if (err) {
			res.status(200).send({success: false, message: 'Cannot get user.'});
		 } else {
			console.log('user retrieved', user);
			res.status(200).send({success: true, message: 'Single user retrieved.', data: user});
		 }
		});
	}
 });

 /**
	* UPDATE USER BY ID
	*/
 router.put('/api/users/:id', function(req, res) {
	let update = {};
	let isUpdated = false;
	const {id} = req.params;
  const {
		first_name,
		last_name,
		email,
		password,
		phone,
		stations,
		manager,
		role,
	} = req.body;
	if (first_name) {
		update.first_name = first_name;
		isUpdated = true;
	}
	if (last_name) {
		update.last_name = last_name;
		isUpdated = true;
	}
	if (first_name || last_name) {
		update.full_name = first_name + " " + last_name;
		isUpdated = true;
	}
	if (email) {
		update.email = email;
		isUpdated = true;
	}
	if (password) {
		update.password = utils.saltAndHash(password);
		isUpdated = true;
	}
	if (phone) {
		update.phone = phone;
		isUpdated = true;
	}
	if (stations && stations.length > 0) {
		update.stations = stations;
		isUpdated = true;
	}
	if (manager) {
		update.manager = manager;
		isUpdated = true;
	}

	if (role) {
		update.role = role;
		isUpdated = true;
	}

	if (isUpdated) {
		update.updated_at = new Date();
		User.findOneAndUpdate({_id: id}, update, {new: true}, function(err, user) {
		 if (err) {
			res.status(200).send({success: false, message: 'Error updating user.'});
		 } else {
			console.log('user updated', user);
			res.status(200).send({success: true, message: 'User updated.', data: user});
		 }
		});
	} else {
		res.status(200).send({success: false, message: 'Nothing to update.'});
	}
 });

	/**
	 * CREATE A USER
	 */
	router.post('/api/users', function(req, res) {
		var data = {
		 first_name: req.body.first_name,
		 last_name: req.body.last_name,
		 full_name: req.body.first_name +' '+ req.body.last_name,
		 email: req.body.email,
		 password: req.body.password,
		 stations: req.body.stations || [],
		 manager: req.body.manager || '',
		 phone: req.body.phone || '',
		 role: req.body.role || 'agent',
		 created_at: new Date(),
		 updated_at: new Date(),
		};
		if (req.body.first_name.toLowerCase() == 'admin' && 
				req.body.last_name.toLowerCase() == 'admin') {
				data['full_name'] = 'ADMIN';
		}
		if (data.first_name == "" || data.first_name == undefined || 
				data.last_name == "" || data.last_name == undefined) {
				res.status(200).send({success: false, message: 'Cannot leave first_name/last_name empty'});
				return;
		}
		if (data.email == "" || data.email == undefined) {
				res.status(200).send({success: false, message: 'Cannot leave email empty'});
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
					const encrypted_password = utils.saltAndHash(data.password);
					data['password'] = encrypted_password;
					console.log('data to send', data);
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
