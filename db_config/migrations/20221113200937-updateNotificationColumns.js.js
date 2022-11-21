"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.addColumn("Notifications", "belongs_to", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.changeColumn("Notifications", "seen", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }),
      await queryInterface.changeColumn("Notifications", "url", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.changeColumn("Notifications", "importance", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      }),
      await queryInterface.removeColumn("Notifications", "belongs_to_table"),
      await queryInterface.changeColumn("Notifications", "belongs_to_role", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {

  },
};
