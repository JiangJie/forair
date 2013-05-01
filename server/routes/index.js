var user = require('../controller/user'),
  product = require('../controller/product');

var route = function(app) {
  app.get('/user/exist', user.isExist);
  app.post('/user/signup', user.signup);
  app.post('/user/signin', user.signin);

  app.post('/admin/product/add', product.create);

  app.get('/product/more', product.get);
  app.get('/product/more/like', product.getLike);
  app.get('/product/more/hot', product.getHot);

  app.put('/product/like/:pid', product.likeOrNot);
};

module.exports = {
  route: route
};