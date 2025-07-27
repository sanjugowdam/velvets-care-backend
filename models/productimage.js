'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  tables: {
    ProductImages
  },
  sequelize
} = require('../config');
  class ProductImage extends Model {
  }
  ProductImage.init({
    product_id: DataTypes.INTEGER,
    file_url: DataTypes.STRING,
    extension: DataTypes.STRING,
    original_name: DataTypes.STRING,
    size: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    modelName: ProductImages,
  });
  
module.exports = ProductImage;
