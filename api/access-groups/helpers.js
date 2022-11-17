const { sequelize } = require("../../db_config/models");
const { QueryTypes } = require("sequelize");

async function handleGroupDelete(groupId) {
  await sequelize.query(
    `
      DELETE AccessGroupRights.*, UserAccessGroups.*
      FROM AccessGroupRights
      LEFT JOIN UserAccessGroups
      ON AccessGroupRights.AccessGroupId = UserAccessGroups.AccessGroupId
      WHERE AccessGroupRights.AccessGroupId = :groupId
    `,
    {
      type: QueryTypes.DELETE,
      replacements: { groupId },
      logging: false,
    }
  );
}

module.exports = {
  handleGroupDelete,
};
