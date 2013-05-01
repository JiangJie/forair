var mongojs = require('mongojs');

var mongoUrl = 'mongodb://idog:air4idog@127.0.0.1:27017/idog';

var db = mongojs(mongoUrl, ['user', 'product']);

module.exports = {
  db: db,
  ObjectId: mongojs.ObjectId
};