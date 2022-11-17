module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("AccessGroupRights", {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      AccessGroupId: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      RightId: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("AccessGroupRights");
  },
};
