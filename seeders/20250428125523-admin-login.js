'use strict';
const {
  tables: {
    Admins
  },
  sequelize
} = require('../config')

module.exports = {
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(Admins, [
      {
        name: 'Admin User',
        email: 'sanjaym3236@gmail.com',
        refresh_token: null,
        access_token: null, // saving hashed "admin" password as access_token (example)
        otp_id: null,
        profile_img_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Admin User',
        email: 'debanjan.full.stack.developer@gmail.com',
        refresh_token: null,
        access_token: null, // saving hashed "admin" password as access_token (example)
        otp_id: null,
        profile_img_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Delete Admin record based on email
    await queryInterface.bulkDelete(Admins, { email:
      ['sanjaym3236@gmail.com', 
      'debanjan.full.stack.developer@gmail.com'] }, {});
  }
};