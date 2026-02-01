'use strict';
const {
  tables: {
    Users,
  },
  sequelize
} = require('../config');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(Users, 'fcm_token', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(Users, 'fcm_token');
  }
};
