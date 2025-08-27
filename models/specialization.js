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
const Files = require('./files');
  class Specialization extends Model {
  }
  Specialization.init({
    name: DataTypes.STRING,
    icon_id: DataTypes.INTEGER,
  },
   {
    sequelize,
    paranoid: true,
    modelName: DoctorSpecializations,
  });

  Specialization.belongsTo(Files, { foreignKey: 'icon_id' });
  Files.hasMany(Specialization, { foreignKey: 'icon_id' });

  module.exports = Specialization;
