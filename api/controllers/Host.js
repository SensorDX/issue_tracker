module.exports = function(router) {
 //=====================
 // Get Host
 //=====================
	router.get('/api/host', function(req, res) {
		const url = req.protocol + '://' + req.get('host');
		return res.status(200).send({'success': true, 'message': 'Host retrieved!', 'url': url});
	});

}
