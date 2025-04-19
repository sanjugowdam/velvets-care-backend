'use strict';
/** @type {import('sequelize-cli').Migration} */
const { Users } = require('../config/tables')
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(Users, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      access_token: {
        type: Sequelize.STRING(2000)
      },
      refresh_token: {
        type: Sequelize.STRING(2000)
      },
      banned: {
        type: Sequelize.BOOLEAN
      },
      verified: {
        type: Sequelize.BOOLEAN
      },
      otp: {
        type: Sequelize.STRING
      },
      otp_time: {
        type: Sequelize.STRING
      },
      avatar_file_name: {
        type: Sequelize.STRING
      },
      avatar_file_url: {
        type: Sequelize.STRING
      },
      avatar_file_extension: {
        type: Sequelize.STRING
      },
      avatar_file_size: {
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
    await queryInterface.dropTable(Users);
  }
};