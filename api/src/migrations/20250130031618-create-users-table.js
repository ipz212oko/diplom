'use strict';

const argon2 = require('argon2');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await argon2.hash("admin");

    await queryInterface.bulkInsert('user', [
      {
        name: "admin",
        surname: "admin",
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        file: null,
        image: null,
        description: 'Administrator account',
        rating: 5,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', { email: 'admin@gmail.com' });
  },
};

