'use strict';
const {
  tables: {
    Subcategories
  },
  sequelize
} = require('../config');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(Subcategories, 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn(Subcategories, 'subcategory_image', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Subcategories', 'description');
    await queryInterface.removeColumn('Subcategories', 'subcategory_image');
  }
};
