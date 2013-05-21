var commentModel = require('../model/comment');

module.exports = {
  create: function(req, res, next) {
    var uid = req.cookies.uid;
    var pid = req.body.pid,
      content = req.body.content;
    if(pid && content) {
      var comment = {uid: uid, pid: pid, content: content, create: new Date()};
      commentModel.create(comment, function(comment) {
        return res.json({recode: 0, success: 1, comment: comment[0]});
      });
    } else {
      return res.json({recode: 0, success: 0});
    }
  },
  get: function(req, res, next) {
    var product = req.dataset.product;
    var pid = req.params.pid;
    commentModel.findByPid(pid, function(comments) {
      product.comment = comments;
      req.dataset.product = product;
      next();
    });
  }
};