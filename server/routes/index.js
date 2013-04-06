var user = require('../controller/user');

var route = function(app) {
  app.get('/user/exist', user.isExist);
  app.post('/user/signup', user.signup);
  app.post('/user/signin', user.signin);
};

module.exports = {
  route: route
};