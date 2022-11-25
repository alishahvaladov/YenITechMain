const { QueryTypes } = require("sequelize");
const { sequelize, AccessGroup, AccessGroupRight, Right } = require("../../db_config/models");
const { handleGroupDelete } = require("./helpers");

module.exports = {
  addNewGroupAndAddRights: async function (name, rightIds) {
    const isExist = await AccessGroup.findOne({
      where: { name }
    });
    if (isExist) {
      throw new Error("This access group already exists")
    }
    const group = await AccessGroup.create({
      name
    });
    const accessGroupBulk = rightIds.map((rightId) => ({ AccessGroupId: group.id, RightId: rightId }));
    await AccessGroupRight.bulkCreate(accessGroupBulk);
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
  getAllGroups: async function (name, givenOffset) {
    let query = `SELECT * FROM AccessGroups`;
    let countQuery = `SELECT COUNT(*) as count FROM AccessGroups`;
    const replacements = {};
    const result = {};
    let offset = 0;


    if (offset && offset !== "" && !isNaN(parseInt(offset))) {
      offset = parseInt(givenOffset);
    }

    if (name && name !== "") {
      query += `
        WHERE name like :name
      `;
      countQuery += `
        WHERE name like :name
      `;
      replacements.name = `%${name}%`;
    }

    query += `
    LIMIT 15 OFFSET :offset`;

    replacements.offset = offset;

    result.groups = await sequelize.query(query, {
      logging: false,
      type: QueryTypes.SELECT,
      replacements
    });

    result.count = await sequelize.query(countQuery, {
      logging: false,
      type: QueryTypes.SELECT,
      replacements
    });

    return result;
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
  },
};
