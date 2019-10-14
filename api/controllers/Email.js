//Libraries
const {vcap} = require('./../utils');
const emailCredentials = vcap.getServiceCreds('tahmo-email-config');
const nodemailer = require('nodemailer');
const mailTransport = nodemailer.createTransport({
 host: emailCredentials.host,
 port: emailCredentials.port,
 secure: true,
 auth: {
  user: emailCredentials.user,
  pass: emailCredentials.password,
 } 
});

module.exports = function(router) {
 //=====================
 // EMAIL USER
 //=====================
	 router.post('/api/sendmail', function(req, res) {
		 var receiver = req.body.to;
		 var subject = req.body.subject;
		 var text = req.body.text;

		 mailTransport.sendMail({
			from: emailCredentials.user,
			to: receiver,
			subject: subject,
			html: text
		 }, function(err){
				if(err) {
				 console.error( 'Unable to send email: ' + err );
				 res.status(200).send({success: false, message: 'Could not send email.', data: err});
				} else {
				 console.log('Mail sent');
				 res.status(200).send({success: true, message: 'Email sent successfully.'});
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
