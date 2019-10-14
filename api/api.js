const AuthCtrl = require('./controllers/Auth');
const CommentCtrl = require('./controllers/Comment');
const EmailCtrl = require('./controllers/Email');
const FaultInboxCtrl = require('./controllers/FaultInbox'); // New
const IssueCtrl = require('./controllers/Issue');
const SiteCtrl = require('./controllers/Site');
const TestCtrl = require('./controllers/Test');
const UploadCtrl = require('./controllers/Upload');
const UserCtrl = require('./controllers/User');

module.exports = function(router) {
	AuthCtrl(router);
	CommentCtrl(router);
  FaultInboxCtrl(router); // New
	EmailCtrl(router);
	IssueCtrl(router);
	SiteCtrl(router);
	TestCtrl(router);
	UploadCtrl(router);
	UserCtrl(router);
};
