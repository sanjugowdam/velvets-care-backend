'use strict';
/** @type {import('sequelize-cli').Migration} */

const {
  tables: {
    Scans
  },
} = require('../config')
module.exports = {
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(Scans, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      brand_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      lattitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      adress: {
        type: Sequelize.STRING
      },
      scan_data: {
        type: Sequelize.STRING
      },
      process_data: {
        type: Sequelize.STRING
      },
      image_id: {
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
    await queryInterface.dropTable(Scans);
  }
};