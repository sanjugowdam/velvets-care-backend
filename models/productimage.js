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

const Products = require('./product');
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
  
  ProductImage.belongsTo(Products, { foreignKey: 'product_id' });
  Products.hasMany(ProductImage, { foreignKey: 'product_id' });
module.exports = ProductImage;
