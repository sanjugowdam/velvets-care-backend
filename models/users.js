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
module.exports = UsersModel;