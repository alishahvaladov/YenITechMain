'use strict';
const moment = require("moment");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert("TimeOffTypes", [{
    name: "Öz hesabına məzuniyyət",
    createdAt: moment().format("YYYY-MM-DD, hh:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD, hh:mm:ss")
   }, {
    name: "Əmək məzuniyyəti",
    createdAt: moment().format("YYYY-MM-DD, hh:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD, hh:mm:ss")
   }, {
    name: "Sağlamlıq Məzuniyyəti",
    createdAt: moment().format("YYYY-MM-DD, hh:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD, hh:mm:ss")
   }, {
    name: "Saatlıq icazə",
    createdAt: moment().format("YYYY-MM-DD, hh:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD, hh:mm:ss")
   }, {
    name: "Analıq Məzuniyyəti",
    createdAt: moment().format("YYYY-MM-DD, hh:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD, hh:mm:ss")
   }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkDelete('TimeOffTypes', null, {});
  }
};
