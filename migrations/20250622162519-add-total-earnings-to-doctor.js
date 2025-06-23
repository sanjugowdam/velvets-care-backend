'use strict';
const {
   DataTypes
 } = require('sequelize');
 const {
  tables: {
    Doctors
  },
  sequelize
} = require('../config')
 
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(Doctors, 'total_earnings', {
      type: Sequelize.FLOAT,
      allowNull: true, // or false, depending on your requirement
      defaultValue: 0, // optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(Doctors, 'total_earnings');
  }
};
