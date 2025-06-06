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
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.STRING
      },
      access_token: {
        type: Sequelize.STRING(2000)
      },
      refresh_token: {
        type: Sequelize.STRING(2000)
      },
      gender: {
        type: Sequelize.STRING
      },
      otp_id: {
        type: Sequelize.INTEGER
      },
      profile_image_id: {
        type: Sequelize.INTEGER
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