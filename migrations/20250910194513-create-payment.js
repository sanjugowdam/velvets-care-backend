'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      payment_status: {
        type: Sequelize.STRING
      },
      payment_method: {
        type: Sequelize.STRING
      },
      payment_reference_id: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DOUBLE
      },
      currency: {
        type: Sequelize.STRING
      },
      razorpay_order_id: {
        type: Sequelize.STRING
      },
      razorpay_payment_response: {
        type: Sequelize.JSON
      },
      notes: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};