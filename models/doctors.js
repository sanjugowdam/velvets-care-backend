'use strict';
const{
  tables:{
    Doctors
  },
  sequelize
} = require('../config')
const {
  Model,
  DataTypes
} = require('sequelize');
const OTPS = require('./otp')
const Files = require('./files')
const Adresses = require('./address')
  class DoctorModel extends Model {
  }
  DoctorModel.init({
    full_name: DataTypes.STRING,
    gender: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    phone: DataTypes.BIGINT,
    email: DataTypes.STRING,
    specialization: DataTypes.STRING,
    years_of_experience: DataTypes.INTEGER,
    registration_number: DataTypes.STRING,
    registration_certificate_id: DataTypes.INTEGER,
    medical_degree_certificate_id: DataTypes.INTEGER,
    profile_image_id: DataTypes.INTEGER,
    consultation_fee: DataTypes.FLOAT,
    consultation_modes: DataTypes.STRING,
    languages_spoken: DataTypes.STRING,
    government_id: DataTypes.INTEGER,
    pan_card_id: DataTypes.INTEGER,
    address_id: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    verified: DataTypes.BOOLEAN,
    otp_id: DataTypes.INTEGER,
    access_token: DataTypes.STRING,
    refresh_token: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    modelName: Doctors,
  });
  
  DoctorModel.belongsTo(Files, { foreignKey: 'registration_certificate_id' });
  Files.hasMany(DoctorModel, { foreignKey: 'registration_certificate_id' });
  
  DoctorModel.belongsTo(Files, { foreignKey: 'medical_degree_certificate_id' });
  Files.hasMany(DoctorModel, { foreignKey: 'medical_degree_certificate_id' });
  
  DoctorModel.belongsTo(Files, { foreignKey: 'profile_image_id' });
  Files.hasMany(DoctorModel, { foreignKey: 'profile_image_id' });
  
  DoctorModel.belongsTo(Files, { foreignKey: 'government_id' });
  Files.hasMany(DoctorModel, { foreignKey: 'government_id' });
  
  DoctorModel.belongsTo(Files, { foreignKey: 'pan_card_id' });
  Files.hasMany(DoctorModel, { foreignKey: 'pan_card_id' });
  
  DoctorModel.belongsTo(Adresses, { foreignKey: 'address_id' });
  Adresses.hasMany(DoctorModel, { foreignKey: 'address_id' });
  
  module.exports = DoctorModel;