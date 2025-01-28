'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user', [
      {
        username: 'admin',
        email: 'admin@gmail.com',
        password: 'admin',
        role: 'admin',
        file: null,
        image: null,
        description: 'Administrator account',
        rating: 5,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', { email: 'admin@gmail.com' });
  },
};

