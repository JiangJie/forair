var db = require('../mongo'),
  d = require('../domain');

var user = {
  findByUid: function(uid, cb) {
    db.user.findOne({uid: uid}, d.intercept(function(user) {
      return cb(user);
    }));
  },
  create: function(user, cb) {
    db.user.insert(user, {safe: true}, d.intercept(function(user) {
      return cb(user);
    }));
  }
};

module.exports = user;