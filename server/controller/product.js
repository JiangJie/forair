var _ = require('underscore');

var procudtModel = require('../model/product');

module.exports = {
  create: function(req, res, next) {
    var product = req.body.product;
    if(product.name && product.url && product.img) {
      procudtModel.create(product, function(product) {
        return res.json({recode: 0, success: 1});
      });
    } else {
      return res.json({recode: 0, success: 0});
    }
  },
  get: function(req, res, next) {
    var uid = req.cookies.uid;
    var start = req.query.start,
      limit = req.query.limit;
    procudtModel.find({start: start, limit: limit}, function(products) {
      if(products && products.length) {
        products.forEach(function(item) {
          if(_.isArray(item.like) && _.contains(item.like, uid)) {
            item.alLike = 1;
          }
        });
      }
      return res.json({recode: 0, products: products});
    });
  },
  likeOrNot: function(req, res, next) {
    var uid = req.cookies.uid,
      pid = req.params.pid,
      isLike = req.body.like;
    procudtModel.findById(pid, function(product) {
      var like = product.like;
      if(!_.isArray(like)) {
        like = [];
      }
      var update = {};
      if(isLike == '1') {
        if(!_.contains(like, uid)) {
          like.push(uid);
          update.$inc = {todayLike: 1};
        } else {
          return res.json({recode: 0, success: 0, msg: 'already like'});
        }
      } else {
        if(_.contains(like, uid)) {
          like.splice(like.indexOf(uid), 1);
        } else {
          return res.json({recode: 0, success: 0, msg: 'already not like'});
        }
      }
      update.$set = {like: like};
      procudtModel.update({query: {_id: procudtModel.ObjectId(pid)}, update: update}, function(product) {
        return res.json({recode: 0, success: 1});
      });
    });
  },
  getLike: function(req, res, next) {
    var uid = req.cookies.uid;
    var start = req.query.start,
      limit = req.query.limit;
    var option = {query: {like: uid}, start: start, limit: limit};
    procudtModel.find(option, function(products) {
      return res.json({recode:0, products: products});
    });
  },
  getHot: function(req, res, next) {
    var uid = req.cookies.uid;
    var start = req.query.start,
      limit = req.query.limit;
    var option = {query: {todayLike: {$exists: 1}}, sort: {todayLike: -1}, start: start, limit: limit};
    procudtModel.find(option, function(products) {
      if(products && products.length) {
        products.forEach(function(item) {
          if(_.isArray(item.like) && _.contains(item.like, uid)) {
            item.alLike = 1;
          }
        });
      }
      return res.json({recode: 0, products: products});
    });
  }
};