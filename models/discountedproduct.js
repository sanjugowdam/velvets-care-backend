'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

const{
  tables: {
    DiscountedProducts
  },
  sequelize
} = require('../config');
  class DiscountedProduct extends Model {
    
  }
  DiscountedProduct.init({
    product_id: DataTypes.INTEGER,
    discount_id: DataTypes.INTEGER,
    usage_limit: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    modelName: DiscountedProducts,
  });
module.exports = DiscountedProduct;