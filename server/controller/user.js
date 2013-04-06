var userModel = require('../model/user');

module.exports = {
  isExist: function(req, res, next) {
    var uid = req.query.uid;
    if(typeof uid === 'string' && uid.trim()) {
      userModel.findByUid(uid, function(user) {
        if(!user) return res.json({recode: 0, isExist: false});
        return res.json({recode: 0, isExist: true});
      });
    } else {
      res.json({recode: 0, isExist: false});
    }
  },
  signup: function(req, res, next) {
    var uid = req.body.uid.trim(),
      pwd = req.body.pwd.trim(),
      rePwd = req.body.rePwd.trim(),
      nickname = req.body.nickname.trim();
    if(uid && pwd && rePwd && nickname) {
      var user = {uid: uid, pwd: pwd, nickname: nickname};
      userModel.create(user, function() {
        res.json('success');
      });
    }
  }
};