//Libraries
const Issue = require('./../models/issues');
const IssueSubscription = require('./../models/issueSubscription');
const Comment = require('./../models/comments');
const Counter = require('./../models/counters');
const User = require('./../models/users');
const mongoose = require('mongoose');
const {
  modifyCommentsDate,
  modifyIssuesDate,
  getNextSequence,
  getSites
} = require('./../utils');
var fetch = require('node-fetch');

module.exports = function(router) {
  //=====================
  // GET ISSUES
  //=====================
  router.get('/api/issues', function(req, res) {
    let url = req && req.headers ? req.headers.host : '';
    url += '/api/sites?provider=tahmo&format=siteCodeObj';
    // url = 'https://tahmoissuetracker.mybluemix.net/api/sites?provider=tahmo&format=siteCodeObj';
    let sites = {};
    const {status, assignee} = req.query;
    let status_query = {};
    let assignee_query = {};
    if (status) {
      status_query = {status};
    }
    if (assignee) {
      assignee_query = {'assignee._id': assignee};
    }

		fetch(url, {
			method: 'GET',
		})
		.then(function(res) {
			return res.json();
		})
		.then(function(response) {
      if (response.success) {
        sites = response.data;
      } 
		})
		.catch(function(err) {
      console.log('err', err);
		});
    Issue.find({$and: [status_query, assignee_query]}, function(err, issues) {
      if (err) {
        res
          .status(200)
          .send({success: false, message: 'Could not retrieve issues.'});
      } else {
        res.status(200).send({
          success: true,
          message: 'Issues retrieved successfully.',
          count: issues.length,
          data: modifyIssuesDate(issues, sites),
        });
      }
    });
  });

  //=====================
  // GET ISSUE SUBSCRIBTION
  //=====================
  router.get('/api/issues/subscriptions', function(req, res) {
    const {user_id, issue_id} = req.query;
    let query = user_id ? {user_id} : {};
    query = issue_id ? {issue_id} : query;
    const distinct = user_id ? 'issue_id' : 'user_id';
    IssueSubscription.find(query).distinct(distinct, function(err, issues) {
      if (err) {
        res
          .status(200)
          .send({success: false, message: 'Could not retrieve issue subscriptions.'});
      } else {
        if (issue_id) {
          User.find({_id: {$in: issues}}, 'email', function(err, users) {
              if(err) {
                res
                  .status(200)
                  .send({success: false, message: 'Could not retrieve issue subscriptions.'});
              } else {
                res.status(200).send({
                  success: true,
                  message: 'Issue subscriptions retrieved successfully.',
                  data: users
                });
              }
          });

        } else {
          res.status(200).send({
            success: true,
            message: 'Issue subscriptions retrieved successfully.',
            data: issues
          });
        }
      }
    });
  });
  //=====================
  // GET ISSUES BY ID
  //=====================
  router.get('/api/issues/:id', function(req, res) {
    let url = req && req.headers ? req.headers.host : '';
    url += '/api/sites?provider=tahmo&format=siteCodeObj';
    // url = 'https://tahmoissuetracker.mybluemix.net/api/sites?provider=tahmo&format=siteCodeObj';
    let sites = {};

		fetch(url, {
			method: 'GET',
		})
		.then(function(res) {
			return res.json();
		})
		.then(function(response) {
      if (response.success) {
        sites = response.data;
      } 
		})
		.catch(function(err) {
      console.log('err', err);
		});
    const {id} = req.params;
    Issue.find({_id: id}, function(err, issue) {
      if (err) {
        res.status(200).send({
          success: false,
          message: 'Could not retrieve the specified issue.',
        });
      } else {
        res.status(200).send({
          success: true,
          message: 'Issue retrieved successfully.',
          data: modifyIssuesDate(issue, sites)[0],
        });
      }
    });
  });

  //=====================
  // GET ISSUES COMMENTS BY ID
  //=====================
  router.get('/api/issues/:id/comments', function(req, res) {
    const {id} = req.params;
    Issue.find({_id: id}, function(err, issue) {
      if (err) {
        res.status(200).send({
          success: false,
          message: 'Could not retrieve the comments for the specified issue.',
        });
      } else {
        const {comments} = issue[0];
        let query = {};
        if (typeof comments === 'object') {
          query = {
            _id: {
              $in: comments.map(function(e) {
                return mongoose.Types.ObjectId(e);
              }),
            },
          };
        } else {
          query = {_id: {$in: comments}};
        }
        Comment.find(query, function(err, comments) {
          if (err) {
            res.status(200).send({
              success: false,
              message:
                'Could not retrieve the comments for the specified issue.',
            });
          } else {
            res.status(200).send({
              success: true,
              message: 'Comment(s) retrieved successfully',
              data: modifyCommentsDate(comments),
            });
          }
        });
      }
    });
  });

  //=====================
  // POST ISSUES COMMENTS
  //=====================
  router.post('/api/issues/:id/comments', function(req, res) {
    const {id} = req.params;
    const {comments} = req.body;
    if (comments == '' || comments == undefined) {
      res
        .status(200)
        .send({success: false, message: 'Cannot leave comments empty'});
      return;
    }
    Issue.findByIdAndUpdate(
      {_id: id},
      {$push: {comments: req.body.comments}},
      {safe: true, upsert: true, new: true},
      function(err, issue) {
        if (err) {
          res.status(200).send({
            success: false,
            message: 'Could not add comments for the specified issue.',
          });
        } else {
          res.status(200).send({
            success: true,
            message: 'Comment added successfully',
            data: issue,
          });
        }
        console.log(err);
      });
  });

  router.get('/api/issues/:id/comments', function(req, res) {
    const {id} = req.params;
    Issue.find({_id: id}, function(err, issue) {
      if (err) {
        res.status(200).send({
          success: false,
          message: 'Could not retrieve the comments for the specified issue.',
        });
      } else {
        const {comments} = issue[0];
        let query = {};
        if (typeof comments === 'object') {
          query = {
            _id: {
              $in: comments.map(function(e) {
                return mongoose.Types.ObjectId(e);
              }),
            },
          };
        } else {
          query = {_id: {$in: comments}};
        }
        Comment.find(query, function(err, comments) {
          if (err) {
            res.status(200).send({
              success: false,
              message:
                'Could not retrieve the comments for the specified issue.',
            });
          } else {
            res.status(200).send({
              success: true,
              message: 'Comment(s) retrieved successfully',
              data: comments,
            });
          }
        });
      }
    });
  });

  //=====================
  // POST ISSUES
  //=====================
  router.post('/api/issues', function(req, res) {
    let data = {
      title: req.body.title,
      description: req.body.description,
      opened_by: req.body.opened_by,
      assignee: req.body.assignee,
      labels: req.body.labels,
      priority: req.body.priority,
      station: req.body.station,
      deviceId: req.body.deviceId,
      status: 'open',
      updated_at: new Date(),
      due_date: req.body.due_date,
      created_at: new Date(),
    };
    for (key in data) {
      if (
        key !== 'station' &&
        key !== 'deviceId' &&
        (data[key] == '' || data[key] == undefined)
      ) {
        res
          .status(200)
          .send({success: false, message: 'Cannot leave ' + key + ' empty'});
        return;
      }
    }
    if (!data['station'] && !data['deviceId']) {
      res
        .status(200)
        .send({success: false, message: 'Cannot leave station empty'});
    }
    getNextSequence('ticket_id').then(
      function(response) {
        if (response.seq) {
          data.ticket_id = response.seq;
          let issue = new Issue(data);
          issue.save(function(err, data) {
            if (err) {
              res.status(200).send({
                success: false,
                message: 'Could not create issue. Try again later!',
              });
            } else {
              res.status(200).send({
                success: true,
                message: 'New issue created',
                data: data,
              });
            }
          });
        } else {
          res.status(200).send({
            success: false,
            message:
              'Could not get new ticket_id for new issue. Try again later!',
          });
        }
      },
      function(error) {
        res.status(200).send({
          success: false,
          message: 'Could not generate new ticket_id. Try again later!',
        });
        return;
      });
  });

  //======================
  // UPDATE ISSUES IN BULK
  //======================
  router.put('/api/issues', function(req, res) {
    const {
      ids,
      title,
      description,
      closed_by,
      assignee,
      comments,
      labels,
      priority,
      station,
      status,
      due_date,
    } = req.body;

    if (ids && ids.length > 0) {
      let update = {};
      let isUpdated = false;

      if (title) {
        update.title = title;
        isUpdated = true;
      }

      if (description) {
        update.description = description;
        isUpdated = true;
      }

      if (closed_by) {
        update.closed_by = closed_by;
        isUpdated = true;
      }

      if (assignee) {
        update.assignee = assignee;
        isUpdated = true;
      }

      if (comments && comments.length > 0) {
        update.comments = comments;
        isUpdated = true;
      }

      if (labels && labels.length > 0) {
        update.labels = labels;
        isUpdated = true;
      }

      if (priority) {
        update.priority = priority;
        isUpdated = true;
      }

      if (station) {
        update.station = station;
        isUpdated = true;
      }

      if (status) {
        update.status = status;
        isUpdated = true;
      }

      if (due_date) {
        update.due_date = due_date;
        isUpdated = true;
      }

      if (isUpdated) {
        let query = {};
        if (typeof ids === 'object') {
          query = {
            _id: {
              $in: ids.map(function(e) {
                return mongoose.Types.ObjectId(e);
              }),
            },
          };
        } else {
          query = {_id: {$in: ids}};
        }
        update.updated_at = new Date();
        console.log(update);
        Issue.update(query, {$set: update}, {multi: true, new: true}, function(err, issue) {
          if (err) {
            res
              .status(200)
              .send({success: false, message: 'Error updating issue(s).'});
          } else {
            res
              .status(200)
              .send({success: true, message: 'Issue(s) updated', data: update});
          }
        });
      } else {
        res.status(200).send({success: false, message: 'Nothing to update.'});
      }
    } else {
      res.status(200).send({
        success: false,
        message: 'Could not update issue(s). Try again later!',
      });
    }
  });

  //======================
  // DELETE ISSUE BY ID
  //======================
  router.delete('/api/issues/:id', function(req, res) {
    const {id} = req.params;
    Issue.remove({_id: id}, function(err, issue) {
      if (err)
        res.status(200).send({
          success: false,
          message: 'Could not delete issue. Try again later!',
        });
      else
        res
          .status(200)
          .send({success: true, message: 'Issue deleted', data: []});
    });
  });

  //=====================
  // POST ISSUE SUBSCRIBTION
  //=====================
  router.post('/api/issues/:issue_id/subscribe', function(req, res) {
    const {issue_id} = req.params;
    const {user_id} = req.body;
    if (issue_id === '' || issue_id === undefined || user_id === '' || user_id === undefined) {
      res
        .status(200)
        .send({
          success: false,
          message: 'Unable to subscribe to issue. Please try again later!',
        });
      return;
    }
    let data = {
      user_id,
      issue_id
    };
    const issueSubscription = new IssueSubscription(data);
    issueSubscription.save(function(err, data) {
      if (err) {
        res.status(200).send({
          success: false,
          message: 'Unable to subscribe to issue. Please try again later!',
        });
      } else {
        res.status(200).send({
          success: true,
          message: 'Successfully subscribed to issue',
          data: data,
        });
      }
    });
  });
  //=====================
  // DELETE ISSUE SUBSCRIBTION
  //=====================
  router.post('/api/issues/:issue_id/unsubscribe', function(req, res) {
    const {issue_id} = req.params;
    const {user_id} = req.body;
    IssueSubscription.remove({issue_id, user_id}, function(err, issue) {
      if (err)
        res.status(200).send({
          success: false,
          message: 'Could not unsubscribe to issue. Please try again later!'
        });
      else
        res
          .status(200)
          .send({success: true, message: 'Successfully unsubscribed to issue', data: []});
    });
  });
};
