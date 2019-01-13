const User = require('./../models/users');
const {
	saltAndHash
}= require('./../utils');

module.exports = function(router) {
 //=====================
 // GET USERS
 //=====================
 router.get('/api/users', function(req, res) {
  const {role, fields} = req.query;
	let query = {};
	let fields_string = "";
	if (role) {
		let roles = role.split(',');
		let result = [];
		for (let i = 0; i < roles.length; ++i) {
			result.push({'role': roles[i]});
		}
		query = {$or: result};
	}
	if (fields) {
		fields_string = fields.split(',').join(" ");
	} else {
		fields_string = "-password";
	}
  User.find(query, fields_string, function(err, users) {
   if (err) {
		res.status(200).send({success: false, message: 'Cannot get users.'});
   } else {
		res.status(200).send({success: true, message: 'Users retrieved.', data: users});
   }
  });
 });

 //=====================
 // GET USERS BY ID
 //=====================
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
			res.status(200).send({success: true, message: "Manager's users retrieved.", data: users});
		 }
		});
	} else {
		User.findById(id, {password: 0}, function(err, user) {
		 if (err) {
			res.status(200).send({success: false, message: 'Cannot get user.'});
		 } else {
			res.status(200).send({success: true, message: 'Single user retrieved.', data: user});
		 }
		});
	}
 });

 //=====================
 // UPDATE USER BY ID
 //=====================
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
		update.password = saltAndHash(password);
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
			res.status(200).send({success: true, message: 'User updated.', data: user});
		 }
		});
	} else {
		res.status(200).send({success: false, message: 'Nothing to update.'});
	}
 });

 //=====================
 // CREATE USER
 //=====================
	router.post('/api/users', function(req, res) {
		let data = {
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
					const encrypted_password = saltAndHash(data.password);
					data['password'] = encrypted_password;
					let user = new User(data);
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
