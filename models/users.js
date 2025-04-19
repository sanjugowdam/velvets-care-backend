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
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  access_token: DataTypes.STRING,
  refresh_token: DataTypes.STRING,
  banned: DataTypes.BOOLEAN,
  verified: DataTypes.BOOLEAN,
  otp: DataTypes.STRING,
  otp_time: DataTypes.STRING,
  avatar_file_name: DataTypes.STRING,
  avatar_file_url: DataTypes.STRING,
  avatar_file_extension: DataTypes.STRING,
  avatar_file_size: DataTypes.STRING
}, {
  sequelize,
  paranoid: true,
  modelName: Users,
});
module.exports = UsersModel;