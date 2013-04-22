var db = require('../mongo'),
  d = require('../domain');

var product = {
  create: function(product, cb) {
    db.product.insert(product, {safe: true}, d.intercept(function(product) {
      return cb(product);
    }));
  },
  find: function(option, cb) {
    var start = parseInt(option.start, 10) || 0,
      limit = parseInt(option.limit, 10);
    if(limit > 0) {
      db.product.find({}).skit(start).limit(limit, d.intercept(function(product) {
        return cb(product);
      });
    } else {
      return cb([]);
    }
  }
};

module.exports = product;