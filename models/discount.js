'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const{
  tables: {
    Discounts
  },
  sequelize
} = require('../config');
  class Discount extends Model {
  }
  Discount.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    type: DataTypes.STRING,
    value: DataTypes.DOUBLE,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    usage_limit: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid: true,
    modelName: Discounts,
  });
module.exports = Discount;