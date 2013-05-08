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
  app.get('/product/more/like', product.getLike);
  app.get('/product/more/hot', product.getHot);
  app.get('/product/more/new', product.getNew);

  app.put('/product/like/:pid', product.likeOrNot);

  app.get('/product/share', product.share);
  app.post('/product/add', product.create);
};

module.exports = {
  route: route
};