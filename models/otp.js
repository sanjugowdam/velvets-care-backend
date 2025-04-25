'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

const {
  tables: {
    Otps
  },
  sequelize
} = require('../config')
class OTP extends Model {
}
OTP.init({
  otp: DataTypes.STRING,
  otp_time: DataTypes.STRING
}, {
  sequelize,
  paranoid: true,
  modelName: Otps,
});

module.exports = OTP;
