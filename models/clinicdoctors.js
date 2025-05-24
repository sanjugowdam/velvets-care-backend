'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  tables:{
    Clinicdoctors
  },
  sequelize
} = require('../config')

const Doctors  =require ('./doctors')
const Clinics = require('./clinics')
  class ClinicDoctors extends Model {
  }
  ClinicDoctors.init({
    doctor_id: DataTypes.INTEGER,
    clinic_id: DataTypes.INTEGER,
    monday_start_time: DataTypes.STRING,
    monday_end_time: DataTypes.STRING,
    tuesday_start_time: DataTypes.STRING,
    tuesday_end_time: DataTypes.STRING,
    wednesday_start_time: DataTypes.STRING,
    wednesday_end_time: DataTypes.STRING,
    thursday_start_time: DataTypes.STRING,
    thursday_end_time: DataTypes.STRING,
    friday_start_time: DataTypes.STRING,
    friday_end_time: DataTypes.STRING,
    saturday_start_time: DataTypes.STRING,
    saturday_end_time: DataTypes.STRING,
    sunday_start_time: DataTypes.STRING,
    sunday_end_time: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    modelName: Clinicdoctors,
  });
  
  ClinicDoctors.belongsTo(Doctors, { foreignKey: 'doctor_id' });
  Doctors.hasMany(ClinicDoctors, { foreignKey: 'doctor_id' });
  
  ClinicDoctors.belongsTo(Clinics, { foreignKey: 'clinic_id' });
  Clinics.hasMany(ClinicDoctors, { foreignKey: 'clinic_id' });
  module.exports = ClinicDoctors
