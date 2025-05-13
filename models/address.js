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

  class Address extends Model {
  }
  Address.init({
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
  });
  
  module.exports = Address