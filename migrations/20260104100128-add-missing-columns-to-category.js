'use strict';
const {
  tables: {
    Categories
  },
  sequelize
} = require('../config');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(Categories, 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn(Categories, 'category_image', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Categories', 'description');
    await queryInterface.removeColumn('Categories', 'category_image');
  }
};
