var user = require('../controller/user'),
  product = require('../controller/product');

var route = function(app) {
  app.get('/user/exist', user.isExist);
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

  app.put('/product/like/:pid', user.check, product.likeOrNot);

  app.get('/product/share', user.check, product.share);
  app.post('/product/add', user.check, product.create);
};

module.exports = {
  route: route
};