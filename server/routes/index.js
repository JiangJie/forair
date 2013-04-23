var user = require('../controller/user'),
  product = require('../controller/product');

var route = function(app) {
  app.get('/user/exist', user.isExist);
  app.post('/user/signup', user.signup);
  app.post('/user/signin', user.signin);

  app.post('/admin/product/add', product.create);
};

module.exports = {
  route: route
};