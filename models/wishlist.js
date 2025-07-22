'use strict';
const {
  tables: {
    Wishlists
  },
  sequelize
} = require('../config')

const {
  Model,
  DataTypes
} = require('sequelize');
  class Wishlist extends Model {
  }
  Wishlist.init({
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    modelName: Wishlists,
  });
  
module.exports = Wishlist;