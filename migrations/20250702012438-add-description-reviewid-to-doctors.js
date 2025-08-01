'use strict';
const {
  tables: {
    Doctors,
    Reviews
  },
  sequelize
} = require('../config')


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(Doctors, 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Doctors', 'description');
  }
};
