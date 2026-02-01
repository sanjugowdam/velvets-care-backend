'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  tables: {
    prescriptions
  },
  sequelize
} = require('../config');
const Doctors = require('./doctors');
const Users = require('./users');
const Files = require('./files');
  class Prescription extends Model {
  }
  Prescription.init({
    prescription_id: DataTypes.STRING,
    doctor_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    file_id: DataTypes.INTEGER,
    prescription_name: DataTypes.STRING,
    uploaded_by: DataTypes.ENUM('doctor', 'user', 'admin'),
  }, {
    sequelize,
    modelName: prescriptions,
    paranoid: true
  });

  Prescription.belongsTo(Doctors, { foreignKey: 'doctor_id' });
  Doctors.hasMany(Prescription, { foreignKey: 'doctor_id' });

  Prescription.belongsTo(Users, { foreignKey: 'user_id' });
  Users.hasMany(Prescription, { foreignKey: 'user_id' });

  Prescription.belongsTo(Files, { foreignKey: 'file_id' });
  Files.hasMany(Prescription, { foreignKey: 'file_id' });
module.exports = Prescription;
