'use strict';
const {
  tables: {
    Doctors
  }
} = require('../config')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(Doctors, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      date_of_birth: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.BIGINT
      },
      email: {
        type: Sequelize.STRING
      },
      specialization: {
        type: Sequelize.STRING
      },
      years_of_experience: {
        type: Sequelize.INTEGER
      },
      registration_number: {
        type: Sequelize.STRING
      },
      registration_certificate_id: {
        type: Sequelize.INTEGER
      },
      medical_degree_certificate_id: {
        type: Sequelize.INTEGER
      },
      profile_image_id: {
        type: Sequelize.INTEGER
      },
      consultation_fee: {
        type: Sequelize.FLOAT
      },
      consultation_modes: {
        type: Sequelize.STRING
      },
      languages_spoken: {
        type: Sequelize.STRING
      },
      government_id: {
        type: Sequelize.INTEGER
      },
      pan_card_id: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      verified: {
        type: Sequelize.BOOLEAN
      },
      otp_id: {
        type: Sequelize.INTEGER
      },
      refresh_token: {
        type: Sequelize.STRING
      },
      access_token: {
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
    await queryInterface.dropTable(Doctors);
  }
};