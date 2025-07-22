'use strict';
const {
  tables: {
    Products
  },
  sequelize
} = require('../config')

const {
  Model,
  DataTypes
} = require('sequelize');

  class Product extends Model {
  }
  Product.init({
    name: DataTypes.STRING,
    mrp_price: DataTypes.DOUBLE,
    selling_price: DataTypes.DOUBLE,
    sku: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    brand_id: DataTypes.INTEGER,
    tags: DataTypes.TEXT,
    is_active: DataTypes.BOOLEAN,
    is_featured: DataTypes.BOOLEAN,
    is_new: DataTypes.BOOLEAN,
    stock: DataTypes.INTEGER,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    paranoid: true,
    modelName: Products,
  });
  
module.exports = Product;


// discount table === dicoiumnt DataTypes

// discounted users -- useid-discountid and how many time suses can use discount

// disxounted products -- productid-discountid and how many time suses can use discount 