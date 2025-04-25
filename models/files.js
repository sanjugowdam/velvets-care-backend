'use strict';
const {
  Model
} = require('sequelize');

const {
  tables: {
    Files
  },
  sequelize
} = require('../config')
  class FILES extends Model {}
  Files.init({
    files_url: DataTypes.STRING,
    extension: DataTypes.STRING,
    original_name: DataTypes.STRING,
    size: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    modelName: Files,
  });

  module.exports = FILES