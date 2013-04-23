var mongojs = require('mongojs');

var mongoUrl = 'mongodb://idog:air4idog@ds051997.mongolab.com:51997/idog';

var db = mongojs(mongoUrl, ['user', 'product']);

module.exports = db;