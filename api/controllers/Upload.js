//Libraries
const path = require('path');

module.exports = function(router) {
 //=====================
 // UPLOAD FILES
 //=====================
	router.post('/api/upload', function(req, res) {
		console.log('upload req', req);
		console.log("req.files", req.files);
		if (!req.files) {
			return res.status(200).send({'success': false, 'message': 'No files were uploaded.'});
		}

		const file = req.files.file;
		const file_path = path.resolve('./src/assets/uploads/'+file.name);
		const url = req.protocol + '://' + req.get('host') + '/assets/uploads/' + file.name;

		file.mv(file_path, function(err) {
			if (err) { 
				return res.status(200).send({'success': false, 'message': err});
			}
			return res.status(200).send({'success': true, 'message': 'File uploaded!', 'url': url});
		});
	});

}
