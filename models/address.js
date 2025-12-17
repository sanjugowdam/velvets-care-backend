'use strict';
const {
  tables: {
    Adresses
  },
  sequelize
} = require('../config')
  

const {
  Model,
  DataTypes
} = require('sequelize');
const Doctors  =require ('../models/doctors')
  class Address extends Model {
  }
  Address.init({
    doctor_id: DataTypes.INTEGER,
    street: DataTypes.STRING,
    area: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    zip: DataTypes.STRING,
    landmark: DataTypes.STRING,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: Adresses,
    paranoid: true
  });
  
  Address.belongsTo(Doctors, { foreignKey: 'doctor_id' });
  Doctors.hasMany(Address, { foreignKey: 'doctor_id' });

  module.exports = Address

