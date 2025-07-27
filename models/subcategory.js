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

class SubCategory extends Model {
}
SubCategory.init({
  name: DataTypes.STRING,
    slug: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    modelName: Subcategories,
  });
module.exports = SubCategory;