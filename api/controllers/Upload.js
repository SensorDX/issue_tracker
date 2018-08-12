//Libraries
const path = require('path');
const q = require('q');
var AWS = require('ibm-cos-sdk');
var config = {
    endpoint: 's3-api.us-geo.objectstorage.softlayer.net/',
    apiKeyId: 'GcCbLdgTEGAMbTDV_qvGkdgQoFXqtc1P4lej7JnTcNGW',
    ibmAuthEndpoint: 'iam.ng.bluemix.net/oidc/token',
    serviceInstanceId: 'crn:v1:bluemix:public:cloud-object-storage:global:a/16a94a5aac6765350e3b23814baba84b:cfff3f7d-aa64-44b8-9361-56d507fcf62b::'
};
AWS.config.setPromisesDependency(require('q').Promise);
var cos = new AWS.S3(config);

function uploadImage(bucketName, itemName, data) {
    console.log(`Creating new item: ${itemName}`);
    return cos.putObject({
        Bucket: bucketName,
        Key: itemName,
				ACL: 'public-read',
        Body: data
    }).promise()
    .then(() => {
        console.log(`Item: ${itemName} created!`);
    })
    .catch((e) => {
        console.log(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

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
		console.log('this is the file', file);
		const file_path = path.resolve('./src/assets/uploads/'+file.name);
		const url = 'https://tickets.s3-api.us-geo.objectstorage.softlayer.net/' + file.name;
		uploadImage('tickets', file.name, file.data);
		return res.status(200).send({'success': true, 'message': 'File uploaded!', 'url': url});
	});

}
