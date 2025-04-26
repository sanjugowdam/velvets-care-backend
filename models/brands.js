'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

const {
  tables: {
    Brands
  },
  sequelize
} = require('../config')

  class BRANDS extends Model { }
  BRANDS.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    modelName: Brands,
  });
  module.exports = BRANDS;
