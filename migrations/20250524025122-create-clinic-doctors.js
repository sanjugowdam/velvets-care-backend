'use strict';
const {
  tables:{
    Clinicdoctors
  },
  sequelize
} = require('../config')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(Clinicdoctors, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctor_id: {
        type: Sequelize.INTEGER
      },
      clinic_id: {
        type: Sequelize.INTEGER
      },
      monday_start_time: {
        type: Sequelize.STRING
      },
      monday_end_time: {
        type: Sequelize.STRING
      },
      tuesday_start_time: {
        type: Sequelize.STRING
      },
      tuesday_end_time: {
        type: Sequelize.STRING
      },
      wednesday_start_time: {
        type: Sequelize.STRING
      },
      wednesday_end_time: {
        type: Sequelize.STRING
      },
      thursday_start_time: {
        type: Sequelize.STRING
      },
      thursday_end_time: {
        type: Sequelize.STRING
      },
      friday_start_time: {
        type: Sequelize.STRING
      },
      friday_end_time: {
        type: Sequelize.STRING
      },
      saturday_start_time: {
        type: Sequelize.STRING
      },
      saturday_end_time: {
        type: Sequelize.STRING
      },
      sunday_start_time: {
        type: Sequelize.STRING
      },
      sunday_end_time: {
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
    await queryInterface.dropTable(Clinicdoctors);
  }
};