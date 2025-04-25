'use strict';
/** @type {import('sequelize-cli').Migration} */
const {
  tables: {
    Otps
  },
  sequelize
} = require('../config')
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(Otps, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      otp: {
        type: Sequelize.STRING
      },
      otp_time: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(Otps);
  }
};