'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    total_amount: DataTypes.DOUBLE,
    status: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    notes: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};