'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  tables: {
    Banners
  },
  sequelize
} = require('../config')

const Files = require('./files')

  class BANNERS extends Model {
  
  }
  BANNERS.init({
    title: DataTypes.STRING,
    banner_image_id: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    modelName: Banners,
  });


  BANNERS.belongsTo(Files, { foreignKey: 'banner_image_id' });
  Files.hasMany(BANNERS, { foreignKey: 'banner_image_id' });
  module.exports = BANNERS


