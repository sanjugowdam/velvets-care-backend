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
module.exports = DiscountedUser;