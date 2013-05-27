var http = require('http'),
  querystring = require('querystring');
var _ = require('underscore');

var procudtModel = require('../model/product');
var MAX_NEW = 60;
var alLike = function(uid, products) {
  if(uid && _.isArray(products) && products.length) {
    products.forEach(function(item) {
      if(_.isArray(item.like) && _.contains(item.like, uid)) {
        item.alLike = 1;
      }
    });
  }
  return products;
}

module.exports = {
  create: function(req, res, next) {
    var uid = req.cookies.uid;
    var numid = req.body.numid,
      title = req.body.title,
      url = req.body.url,
      pic = req.body.pic,
      brand = req.body.brand,
      price = req.body.price,
      type = req.body.type,
      twitter = req.body.twitter;
    if(title && url && pic && twitter) {
      var product = {uid: uid, numid: numid, title: title, url: url, pic: pic, brand: brand, price: price, type: type, twitter: twitter, create: new Date()};
      procudtModel.create(product, function(product) {
        if(Object.prototype.toString.call(product) === '[object Error]') return res.json({recode: 0, success: 0, msg: 'already share'});
        return res.json({recode: 0, success: 1});
      });
    } else {
      return res.json({recode: 0, success: 0});
    }
  },
  get: function(req, res, next) {
    var uid = req.cookies.uid;
    var start = req.query.start,
      limit = req.query.limit,
      q = req.query.q,
      t = req.query.t;
    var query = {};
    if(q) {
      q = new RegExp(q, 'i');
      query.title = q;
    }
    if(t) {
      query.type = t;
    }
    procudtModel.find({query: query, start: start, limit: limit}, function(products) {
      products = alLike(uid, products);
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
    if(uid) {
      var start = req.query.start,
        limit = req.query.limit;
      var option = {query: {like: uid}, start: start, limit: limit};
      procudtModel.find(option, function(products) {
        return res.json({recode:0, products: products});
      });
    } else {
      return res.json({recode:0, products: null});
    }
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
  },
  share: function(req, res, next) {
    var uid = req.cookies.uid;
    var url = req.query.url;
    var data = {url: url};
    data = querystring.stringify(data);
    var shareReq = http.request({
      host: 'www.mogujie.com',
      path: '/twitter/goodsinfo',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length,
        'Cookie': '__ud_=11j4lwo; __mogujie=LJ2NUmrGP9ktm2JFvXKLzmVoHHt47CRJ6eCzaKEqn7mEXohD2UPMEDf1ck9%2FVYHhrlsOX73r9m3NWVt7cdd0ag%3D%3D; __pk_=ihUJ95OKnPsJK41Ouwr7%2FcF%2F21iiNelRhovegGvnSku6cA'
      }
    }, function(shareRes) {
      shareRes.setEncoding('utf8');
      var result = '';
      shareRes.on('end', function() {
        result = JSON.parse(result);
        if(result.status.code == 1001) {
          var share = {
            numid: result.result.data.detail.num_id,
            price: result.result.data.detail.price,
            pic: result.result.data.detail.pic_url,
            title: result.result.data.detail.title,
            url: result.result.data.detail.goodsUrl,
            brand: result.result.data.detail.brand
          };
          res.json({recode: 0, share: share});
        } else {
          return res.json({recode: 1});
        }
      });
      shareRes.on('readable', function() {
        result += shareRes.read();
      });
    });
    shareReq.on('error', function(e) {
      console.error('problem with request: ' + e.message);
      return res.json({recode: 1});
    });
    shareReq.write(data);
    shareReq.end();
  },
  getNew: function(req, res, next) {
    var uid = req.cookies.uid;
    var start = req.query.start,
      limit = req.query.limit;
    if(start < MAX_NEW) {
      procudtModel.find({sort: {create: -1}, start: start, limit: limit}, function(products) {
        products = alLike(uid, products);
        return res.json({recode: 0, products: products});
      });
    } else {
      res.json({recode: 0, products: null});
    }
  },
  getMy: function(req, res, next) {
    var uid = req.cookies.uid;
    var start = req.query.start,
      limit = req.query.limit;
    procudtModel.find({query: {uid: uid}, sort: {create: -1}, start: start, limit: limit}, function(products) {
      products = alLike(uid, products);
      return res.json({recode: 0, products: products});
    });
  },
  getById: function(req, res, next) {
    var uid = req.cookies.uid;
    var pid = req.params.pid;
    if(pid) {
      procudtModel.findById(pid, function(product) {
        if(product) {
          if(!product.create) product.create = new Date();
          req.dataset = {};
          req.dataset.product = product;
          return next();
        } else {
          return res.json({recode: 0, product: null});
        }
      });
    }
  }
};