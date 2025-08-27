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

const Brands = require('./brand');
const Categories = require('./category');

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

  Product.belongsTo(Categories, { foreignKey: 'category_id' });
  Categories.hasMany(Product, { foreignKey: 'category_id' });

  Product.belongsTo(Brands, { foreignKey: 'brand_id' });
  Brands.hasMany(Product, { foreignKey: 'brand_id' });



  // Product.hasMany(Reviews, { foreignKey: 'product_id' });
  // Reviews.belongsTo(Product, { foreignKey: 'product_id' });
  
module.exports = Product;


// discount table === dicoiumnt DataTypes

// discounted users -- useid-discountid and how many time suses can use discount

// disxounted products -- productid-discountid and how many time suses can use discount 