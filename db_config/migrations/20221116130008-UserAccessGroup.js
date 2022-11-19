module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("UserAccessGroups", {
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
      UserId: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("UserAccessGroups");
  },
};
