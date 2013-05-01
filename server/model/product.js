var _ = require('underscore');

var mongo = require('../mongo'),
  db = mongo.db,
  ObjectId = mongo.ObjectId,
  d = require('../domain');

var product = {
  ObjectId: ObjectId,
  create: function(product, cb) {
    db.product.insert(product, {safe: true}, d.intercept(function(product) {
      return cb(product);
    }));
  },
  find: function(option, cb) {
    var start = parseInt(option.start, 10) || 0,
      limit = parseInt(option.limit, 10),
      query = option.query || {},
      sort = option.sort || {};
    if(limit > 0) {
      db.product.find(query).sort(sort).skip(start).limit(limit, d.intercept(function(products) {
        return cb(products);
      }));
    } else {
      db.product.find(query).sort(sort).skip(start, d.intercept(function(products) {
        return cb(products);
      }));
    }
  },
  update: function(option, cb) {
    db.product.update(option.query, option.update, d.intercept(function(product) {
      return cb(product);
    }));
  },
  findById: function(id, cb) {
    (_.isString(id)) && (id = ObjectId(id));
    db.product.findOne({_id: id}, d.intercept(function(product) {
      cb(product);
    }));
  }
};

module.exports = product;