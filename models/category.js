'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

const{
  tables: {
    Categories
  },
  sequelize
} = require('../config');
  class Category extends Model {
  }
  Category.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.TEXT,
    category_image: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid: true,
    modelName: Categories,
  });
 
module.exports = Category;