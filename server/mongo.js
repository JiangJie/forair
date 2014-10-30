var mongojs = require('mongojs');

var mongoUrl = 'mongodb://127.0.0.1:27017/idog';

var db = mongojs(mongoUrl, ['user', 'product', 'comment']);

module.exports = {
  db: db,
  ObjectId: mongojs.ObjectId
};