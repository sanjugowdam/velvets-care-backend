'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

const{
  tables: {
    DiscountedUsers
  },
  sequelize
} = require('../config');

const Discount = require('./discount');

const User = require('./users');

  class DiscountedUser extends Model {
  }
  DiscountedUser.init({
    user_id: DataTypes.INTEGER,
    discount_id: DataTypes.INTEGER,
    used_count: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    modelName: DiscountedUsers,
  });

  DiscountedUser.belongsTo(Discount, { foreignKey: 'discount_id' });
  Discount.hasMany(DiscountedUser, { foreignKey: 'discount_id' });

  DiscountedUser.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(DiscountedUser, { foreignKey: 'user_id' });
  
module.exports = DiscountedUser;