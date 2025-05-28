'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const{
  tables: {
    Clinics
  },
  sequelize
} = require('../config')
module.exports = (sequelize, DataTypes) => {
}
    const Files = require('./files')
  class CLINICS extends Model {
  }
  CLINICS.init({
    name: DataTypes.STRING,
    street: DataTypes.STRING,
    floor_number: DataTypes.STRING,
    area: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    pincode: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    image_id: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    paranoid: true,
    modelName: Clinics,
  });

  CLINICS.belongsTo(Files, { foreignKey: 'image_id' });
  Files.hasMany(CLINICS, { foreignKey: 'image_id' });
  module.exports = CLINICS