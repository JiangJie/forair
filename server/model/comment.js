var mongo = require('../mongo'),
  db = mongo.db,
  ObjectId = mongo.ObjectId,
  d = require('../domain');

var comment = {
  ObjectId: ObjectId,
  create: function(comment, cb) {
    db.comment.insert(comment, {safe: true}, d.intercept(function(comment) {
      return cb(comment);
    }));
  },
  findByPid: function(pid, cb) {
    db.comment.find({pid: pid}).sort({create: -1}, d.intercept(function(comments) {
      return cb(comments);
    }));
  }
};

module.exports = comment;