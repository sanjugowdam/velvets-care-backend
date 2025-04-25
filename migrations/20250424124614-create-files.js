'use strict';
/** @type {import('sequelize-cli').Migration} */

const {
  tables: {
    Files
  },
  sequelize
} = require('../config')
module.exports = {
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(Files, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      files_url: {
        type: Sequelize.STRING
      },
      extension: {
        type: Sequelize.STRING
      },
      original_name: {
        type: Sequelize.STRING
      },
      size: {
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
    await queryInterface.dropTable(Files);
  }
};