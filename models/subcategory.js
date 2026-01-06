'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

const{
  tables: {
    Subcategories
  },
  sequelize
} = require('../config');

const Category = require('./category');
const Files = require('./files');

class SubCategory extends Model {
}
SubCategory.init({
  name: DataTypes.STRING,
    slug: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    subcategory_image: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    modelName: Subcategories,
  });

  SubCategory.belongsTo(Category, { foreignKey: 'category_id' });
  Category.hasMany(SubCategory, { foreignKey: 'category_id' });

  SubCategory.belongsTo(Files, { foreignKey: 'subcategory_image' });
  Files.hasMany(SubCategory, { foreignKey: 'subcategory_image' });

module.exports = SubCategory;