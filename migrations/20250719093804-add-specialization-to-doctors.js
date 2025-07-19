'use strict';
const {
  tables: {
    Doctors,
    DoctorSpecializations
  },
  sequelize
} = require('../config')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(Doctors, 'specialization_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: DoctorSpecializations, // your actual table name
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(Doctors, 'specialization_id');

  }
};


