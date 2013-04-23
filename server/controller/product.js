var procudtModel = require('../model/product');

module.exports = {
  create: function(req, res, next) {
    var product = req.body.product;
    if(product.name && product.url && product.img) {
      procudtModel.create(product, function(product) {
        return res.json({recode: 0, success: 1});
      });
    } else {
      return res.json({recode: 0, success: 0});
    }
  }
};