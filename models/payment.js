'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payment.init({
    order_id: DataTypes.INTEGER,
    payment_status: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    payment_reference_id: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
    currency: DataTypes.STRING,
    razorpay_order_id: DataTypes.STRING,
    razorpay_payment_response: DataTypes.JSON,
    notes: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};