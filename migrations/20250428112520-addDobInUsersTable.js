'use strict';
const {
  tables:{
    Users
  },
  } = require('../config')


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add "Dob" column to "Users" table
    await queryInterface.addColumn(Users, 'dob', {
      type: Sequelize.STRING, // DATEONLY if you want only date (no time)
      allowNull: true,          // Set false if you want to make it mandatory
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove "Dob" column from "Users" table
    await queryInterface.removeColumn(Users, 'dob');
  }
};
