'use strict';
const{
  tables: {
    Reviews
  },
  sequelize
} = require('../config')

const {
  Model,
  DataTypes
} = require('sequelize');
const Users  =require ('../models/users')
const doctors  =require ('../models/doctors')
  class REVIEWS extends Model {
  }
  REVIEWS.init({
    doctor_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    rating: DataTypes.FLOAT,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    paranoid: true,
    modelName: Reviews,
  });
  
  REVIEWS.belongsTo(Users, { foreignKey: 'user_id' });
  Users.hasMany(REVIEWS, { foreignKey: 'user_id' });

  REVIEWS.belongsTo(doctors, { foreignKey: 'doctor_id' });
  doctors.hasMany(REVIEWS, { foreignKey: 'doctor_id' });

  module.exports = REVIEWS

