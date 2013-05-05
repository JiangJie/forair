var http = require('http'),
  querystring = require('querystring');
var _ = require('underscore');

var procudtModel = require('../model/product');

module.exports = {
  create: function(req, res, next) {
    var uid = req.cookies.uid;
    var numid = req.body.numid,
      title = req.body.title,
      url = req.body.url,
      pic = req.body.pic,
      brand = req.body.brand,
      price = req.body.price,
      twitter = req.body.twitter;
    if(title && url && pic && twitter) {
      var product = {uid: uid, numid: numid, title: title, url: url, pic: pic, brand: brand, price: price, twitter: twitter};
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
        'Cookie': '__ud_=117fyqg; __mogujie=c%2FTBIkPCcYHKYfKK87X2Khz9ZFMzfHQmKQJGrziyN21LXVYyq70lDo8C341eGbWB9VaJ9NFWjpJdKr3MJUUcyA%3D%3D; __pk_=OALpe3nB3gYaqZngRv%2FOZgPhhdl6G8XUNzkG%2B3rmkgRMfw'
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
  }
};