'use strict';

const {
  tables: {
    Doctorsavailabilities
  },
  sequelize
} = require('../config')
const {
  Model,
  DataTypes
} = require('sequelize');
const  Doctors  =require ('../models/doctors')
  class DoctorAvailability extends Model {
  }
  DoctorAvailability.init({
    doctor_id: DataTypes.INTEGER,
    day: DataTypes.STRING,
    start_time: DataTypes.STRING,
    end_time: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    modelName: Doctorsavailabilities,
  });

  DoctorAvailability.belongsTo(Doctors, { foreignKey: 'doctor_id' });
  Doctors.hasMany(DoctorAvailability, { foreignKey: 'doctor_id' });

  module.exports = DoctorAvailability

