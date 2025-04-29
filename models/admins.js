'use strict';
const {
  tables: {
    Admins
  },
  sequelize
} = require('../config')
const {
  Model,
  DataTypes
} = require('sequelize');
const OTPS = require('./otp')
const Files = require('./files')
  class ADMINS extends Model {
  }
  ADMINS.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    otp_id: DataTypes.INTEGER,
    refresh_token: DataTypes.STRING,
    access_token: DataTypes.STRING,
    profile_img_id: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    modelName: Admins,
  });
 
  ADMINS.belongsTo(OTPS, { foreignKey: 'otp_id' });
  OTPS.hasMany(ADMINS, { foreignKey: 'otp_id' });

  ADMINS.belongsTo(Files, { foreignKey: 'profile_img_id' });
  Files.hasMany(ADMINS, { foreignKey: 'profile_img_id' });
  module.exports = ADMINS;