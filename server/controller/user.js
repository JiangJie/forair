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
        next();
      }, function() {
        res.end();
      });
    } else {
      res.end();
    }
  },
  isExist: function(req, res, next) {
    var uid = req.query.uid;
    if(uid && typeof uid === 'string') {
      userModel.findByUid(uid, function(user) {
        if(!user) return res.json({recode: 0, isExist: 0});
        return res.json({recode: 0, isExist: 1});
      });
    } else {
      res.json({recode: 0, isExist: 0});
    }
  },
  signup: function(req, res, next) {
    var uid = req.body.uid,
      pwd = req.body.pwd,
      rePwd = req.body.rePwd,
      nickname = req.body.nickname;
    if(uid && pwd && rePwd && nickname && (pwd === rePwd)) {
      var user = {uid: uid, pwd: pwd, nickname: nickname};
      userModel.create(user, function() {
        res.json({recode: 0, success: 1});
      });
    } else {
      res.json({recode: 0, success: 0});
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
      res.json({recode: 0, success: 0});
    }
  }
};