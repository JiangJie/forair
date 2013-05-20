var user = require('../controller/user'),
  product = require('../controller/product');

var route = function(app) {
  app.get('/user/exist/uid', user.isUidExist);
  app.get('/user/exist/email', user.isEmailExist);
  app.get('/user/info', user.info);
  app.post('/user/signup', user.signup);
  app.post('/user/signin', user.signin);
  app.get('/user/logout', user.logout);

  // app.post('/admin/product/add', product.create);

  app.get('/product/more', product.get);
  app.get('/product/more/like', user.check, product.getLike);
  app.get('/product/more/hot', product.getHot);
  app.get('/product/more/new', product.getNew);
  app.get('/my', product.getMy);
  app.get('/product/detail/:pid', product.getById, user.fillNickname);

  app.put('/product/like/:pid', user.check, product.likeOrNot);

  app.get('/product/share', user.check, product.share);
  app.post('/product/add', user.check, product.create);

  app.get('/user/watch', user.check, user.watch);
};

module.exports = {
  route: route
};