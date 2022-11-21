const { sequelize, AccessGroup, AccessGroupRight, Right } = require("../../db_config/models");
const { handleGroupDelete } = require("./helpers");

module.exports = {
  addNewGroup: async function (name) {
    await AccessGroup.findOrCreate({
      where: { name },
      default: {
        name,
      },
    });
  },
  addRightsToGroup: async function (groupId, rightId) {
    const group = await AccessGroup.findByPk(groupId);
    const right = await Right.findByPk(rightId);
    if (!group || !right) throw new Error("Group or right not found");

    const isExists = await AccessGroupRight.findOne({ where: { AccessGroupId: groupId, RightId: rightId } });
    if (isExists) throw new Error("Right already exists for this group");

    await AccessGroupRight.create({ AccessGroupId: groupId, RightId: rightId });
  },
  getGroupById: async function (groupId) {
    const group = await AccessGroup.findByPk(groupId, {
      include: {
        model: Right,
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
      attributes: ["id", "name"],
    });
    if (!group) throw new Error("Group not found");

    return group;
  },
  getAllGroups: async function () {
    return await AccessGroup.findAll({ attributes: ["id", "name"] });
  },
  updateGroup: async function (groupId, name) {
    const result = await AccessGroup.update(
      { name },
      {
        where: {
          id: groupId,
        },
      }
    );
    if (result === 0) throw new Error("Group not found");
  },
  deleteGroup: async function (groupId) {
    const result = await AccessGroup.destroy({
      where: {
        id: groupId,
      },
    });
    if (result === 0) throw new Error("Group not found");
    await handleGroupDelete(groupId);
  },
  deleteRoleForGroup: async function (groupId, rightId) {
    const result = await AccessGroupRight.destroy({
      where: {
        AccessGroupId: groupId,
        RightId: rightId,
      },
    });
    if (result === 0) throw new Error("Group or right not found");
  },
  getAllRights: async function () {
    return await Right.findAll({ attributes: ["id", "name"] });
  }
};
