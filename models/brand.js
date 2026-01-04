'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const{
  tables: {
    Brands
  },
  sequelize
} = require('../config');

  class Brand extends Model {
  }
  Brand.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.TEXT,
    brand_image: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid: true,
    modelName: Brands,
  });
 
module.exports = Brand;
