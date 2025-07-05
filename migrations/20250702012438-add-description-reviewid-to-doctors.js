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

    await queryInterface.addColumn(Doctors, 'review_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'reviews', // Make sure the Reviews table exists before this migration runs
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Doctors', 'description');
    await queryInterface.removeColumn('Doctors', 'review_id');
  }
};
