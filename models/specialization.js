'use strict';
const{
  tables: {
    DoctorSpecializations
  },
  sequelize
} = require('../config')

const {
  Model,
  DataTypes,
} = require('sequelize');
  class Specialization extends Model {
  }
  Specialization.init({
    name: DataTypes.STRING
  },
   {
    sequelize,
    paranoid: true,
    modelName: DoctorSpecializations,
  });

  module.exports = Specialization;
