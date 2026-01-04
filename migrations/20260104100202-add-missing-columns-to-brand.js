'use strict';
const {
  tables: {
    Brands
  },
  sequelize
} = require('../config');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(Brands, 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn(Brands, 'brand_image', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Brands', 'description');
    await queryInterface.removeColumn('Brands', 'brand_image');
  }
};
