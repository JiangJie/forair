var user = require('../controller/user');

var route = function(app) {
  app.get('/user/exist', user.isExist);
  app.post('/user', user.signup);
};

module.exports = {
  route: route
};