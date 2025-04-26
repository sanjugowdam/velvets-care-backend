'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  tables: {
    Users
  },
  sequelize
} = require('../config')
const OTPS = require('./otp')
class UsersModel extends Model {}
UsersModel.init({
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  gender: DataTypes.STRING,
  otp_id: DataTypes.INTEGER,
  access_token: DataTypes.STRING,
  refresh_token: DataTypes.STRING,
  distance_preference: DataTypes.STRING,
  profile_image_id: DataTypes.INTEGER,
}, {
  sequelize,
  paranoid: true,
  modelName: Users,
});

 // associations can be defined here
  UsersModel.belongsTo(OTPS, { foreignKey: 'otp_id' });
  OTPS.hasMany(UsersModel, { foreignKey: 'otp_id' });

module.exports = UsersModel;