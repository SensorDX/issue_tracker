//Libraries
const Comment = require('./../models/comments');
const {modifyCommentsDate} = require('./../utils');

module.exports = function(router) {
  //=====================
  // GET COMMENTS
  //=====================
  router.get('/api/comments', function(req, res) {
    const {status} = req.query;
    let query = {};
    if (status) {
      query = {status};
    }
    Comment.find(query, function(err, comments) {
      if (err) {
        res
          .status(200)
          .send({success: false, message: 'Could not retrieve comments.'});
      } else {
        res
          .status(200)
          .send({
            success: true,
            message: 'Comments retrieved successfully.',
            count: comments.length,
            data: modifyCommentsDate(comments),
          });
      }
    });
  });

  //=====================
  // GET COMMENTS BY ID
  //=====================
  router.get('/api/comments/:id', function(req, res) {
    const {id} = req.params;
    Comment.find({_id: id}, function(err, comment) {
      if (err) {
        res
          .status(200)
          .send({
            success: false,
            message: 'Could not retrieve the specified comment.',
          });
      } else {
        res
          .status(200)
          .send({
            success: true,
            message: 'Comment retrieved successfully.',
            data: modifyCommentsDate(comment)[0],
          });
      }
    });
  });

  //=====================
  // CREATE COMMENTS
  //=====================
  router.post('/api/comments', function(req, res) {
    const data = {
			created_by: req.body.created_by,
      message: req.body.message,
      picture: req.body.picture,
      updated_at: new Date(),
      created_at: new Date(),
    };
    for (key in data) {
      if ((data[key] == '' || data[key] == undefined) && key !== 'picture') {
        res
          .status(200)
          .send({success: false, message: 'Cannot leave ' + key + ' empty'});
        return;
      }
    }
		const comment = new Comment(data);
		comment.save(function(err, data) {
			if (err) {
				res
					.status(200)
					.send({
						success: false,
						message: 'Could not create comment. Try again later!',
					});
			} else {
				res
					.status(200)
					.send({
						success: true,
						message: 'New comment created',
						data: data,
					});
			}
		});
  });
  //======================
  // UPDATE COMMENTS BY ID
  //======================
  router.put('/api/comments/:id', function(req, res) {
		let update = {};
		let isUpdated = false;
		const {id} = req.params;
		const {message} = req.body;

		if (message) {
			update.message = message;
			isUpdated = true;
		}

		if (isUpdated) {
			update.updated_at = new Date();
			Comment.findOneAndUpdate({_id: id}, update, {new: true}, function(err, comment) {
			 if (err) {
				res.status(200).send({success: false, message: 'Error updating comment.'});
			 } else {
				console.log('comment updated', comment);
				res.status(200).send({success: true, message: 'Comment updated.', data: comment});
			 }
			});
		} else {
			res.status(200).send({success: false, message: 'Nothing to update.'});
		}
	});

  //======================
  // DELETE COMMENT BY ID
  //======================
  router.delete('/api/comments/:id', function(req, res) {
    const {id} = req.params;
    Comment.remove({_id: id}, function(err, comment) {
      if (err) {
        res
          .status(200)
          .send({
            success: false,
            message: 'Could not delete comment. Try again later!',
          });
     	} else {
        res
          .status(200)
          .send({success: true, message: 'Comment deleted', data: []});
			}
    });
  });
};
