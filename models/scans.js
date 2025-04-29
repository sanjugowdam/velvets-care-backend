'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  tables: {
    Scans
  },
  sequelize
} = require('../config')
const  Files  = require('./files')
const Users = require('./users')
const Brands = require('./brands')

  class SCANS extends Model {
  }
  SCANS.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    brand_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    lattitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    adress: DataTypes.STRING,
    scan_data: DataTypes.STRING(5000),
    process_data: DataTypes.STRING,
    image_id: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    modelName: Scans,
  });

  SCANS.belongsTo(Files, { foreignKey: 'image_id' });
  Files.hasMany(SCANS, { foreignKey: 'image_id' });

  SCANS.belongsTo(Users, { foreignKey: 'user_id' });
  Users.hasMany(SCANS, { foreignKey: 'user_id' });

  SCANS.belongsTo(Brands, { foreignKey: 'brand_id' });
  Brands.hasMany(SCANS, { foreignKey: 'brand_id' });
  
  module.exports = SCANS