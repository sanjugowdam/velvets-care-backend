'use strict';
const {
  tables:{
    Carts
  },
  sequelize,
} = require('../config');
 
const {
  Model,
  DataTypes
} = require('sequelize');

  class Cart extends Model {
  }
  Cart.init({
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    modelName: Carts,
  });

module.exports = Cart;