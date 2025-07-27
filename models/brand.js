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
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid: true,
    modelName: Brands,
  });
 
module.exports = Brand;
