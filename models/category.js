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
const Files = require('./files');
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

  Category.belongsTo(Files, { foreignKey: 'category_image' });
  Files.hasMany(Category, { foreignKey: 'category_image' });

module.exports = Category;