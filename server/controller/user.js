var userModel = require('../model/user');

var auth = function(uid, skey, cb, cbNull) {
  var user = {uid: uid, pwd: skey};
  userModel.findByUser(user, function(user) {
    if(!user) return cbNull();
    return cb();
  });
}

module.exports = {
  check: function(req, res, next) {
    var uid = req.cookies.uid,
      skey = req.cookies.skey;
    if(uid && skey) {
      auth(uid, skey, function() {
        return next();
      }, function() {
        return res.json({recode: -1, success: 0, msg: 'no auth'});
      });
    } else {
      return res.json({recode: -1, success: 0, msg: 'no auth'});
    }
  },
  isUidExist: function(req, res, next) {
    var uid = req.query.uid;
    if(uid && typeof uid === 'string') {
      userModel.findByUid(uid, function(user) {
        if(!user) return res.json({recode: 0, isExist: 0});
        return res.json({recode: 0, isExist: 1});
      });
    } else {
      return res.json({recode: 0, isExist: 0});
    }
  },
  isEmailExist: function(req, res, next) {
    var email = req.query.email;
    if(email && typeof email === 'string') {
      userModel.findByEmail(email, function(user) {
        if(!user) return res.json({recode: 0, isExist: 0});
        return res.json({recode: 0, isExist: 1});
      });
    } else {
      return res.json({recode: 0, isExist: 0});
    }
  },
  signup: function(req, res, next) {
    var uid = req.body.uid,
      email = req.body.email,
      pwd = req.body.pwd,
      rePwd = req.body.rePwd,
      nickname = req.body.nickname;
    if(uid && email && pwd && rePwd && nickname && (pwd === rePwd)) {
      var user = {uid: uid, email: email, pwd: pwd, nickname: nickname};
      userModel.create(user, function() {
        return res.json({recode: 0, success: 1});
      });
    } else {
      return res.json({recode: 0, success: 0});
    }
  },
  signin: function(req, res, next) {
    var uid = req.body.uid,
      pwd = req.body.pwd;
    if(uid && pwd) {
      auth(uid, pwd, function() {
        res.cookie('uid', uid, {maxAge: 864000000000});
        res.cookie('skey', pwd, {maxAge: 864000000000});
        return res.redirect('/');
      }, function() {
        return res.json({recode: 0, success: 0});
      });
    } else {
      return res.json({recode: 0, success: 0});
    }
  },
  logout: function(req, res, next) {
    var referer = req.headers.referer;
    res.clearCookie('uid');
    res.clearCookie('skey');
    if(referer) return res.redirect(referer);
    return res.redirect('/');
  },
  info: function(req, res, next) {
    var uid = req.cookies.uid,
      skey = req.cookies.skey;
    var u = req.query.u || uid;
    if(!u) {
      if(uid) {
        userModel.findByUid(uid, function(user) {
          if(!user) return res.json({recode: 0});
          return res.json({recode: 0, info: {nickname: user.nickname, private: 1}});
        });
      } else {
        return res.json({recode: 0});
      }
    }
    else if(u == uid && uid && skey) {
      auth(uid, skey, function() {
        userModel.findByUid(uid, function(user) {
          if(!user) return res.json({recode: 0});
          return res.json({recode: 0, info: {nickname: user.nickname, private: 1}});
        });
      }, function() {
        return res.json({recode: 0});
      });
    } else {
      userModel.findByUid(u, function(user) {
        if(!user) return res.json({recode: 0});
        return res.json({recode: 0, info: {nickname: user.nickname}});
      });
    }
  },
  watch: function(req, res, next) {

  },
  fillNickname: function(req, res, next) {
    var product = req.dataset.product;
      u = product.uid;
    userModel.findByUid(u, function(user) {
      if(!user) product.nickname = u;
      else product.nickname = user.nickname;
      // if(product.comment && product.comment.length) {
      //   product.comment.forEach(function(item) {
      //     userModel.findByUid(item.uid, function(user) {
      //       item.nickname = user.nickname;
      //     });
      //   });
      // }
      return res.json({recode: 0, product: product});
    });
  }
};