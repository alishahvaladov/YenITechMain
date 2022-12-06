const { QueryTypes, Op } = require("sequelize");
const { sequelize, AccessGroup, AccessGroupRight, Right, AGroupNavbarRel, Navbar } = require("../../db_config/models");
const { handleGroupDelete } = require("./helpers");

module.exports = {
  addNewGroupAndAddRights: async function (name, rightIds, navbarIDs) {
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
    const navbarGroupBulk = navbarIDs.map((navID) => ({ nav_id: navID, agroup_id: group.id }));
    await AccessGroupRight.bulkCreate(accessGroupBulk);
    await AGroupNavbarRel.bulkCreate(navbarGroupBulk);
  },
  addRightsToGroup: async function (groupId, rightId) {
    const group = await AccessGroup.findByPk(groupId);
    const right = await Right.findByPk(rightId);
    if (!group || !right) throw new Error("Group or right not found");

    const isExists = await AccessGroupRight.findOne({ where: { AccessGroupId: groupId, RightId: rightId } });
    if (isExists) throw new Error("Right already exists for this group");

    await AccessGroupRight.create({ AccessGroupId: groupId, RightId: rightId });
  },
  getGroupAndNavbarById: async function (groupId) {
    const result = {};
    result.group = await AccessGroup.findByPk(groupId, {
      include: {
        model: Right,
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
      attributes: ["id", "name"],
    });
    if (!result.group) throw new Error("Group not found");

      result.navbar = await sequelize.query(`SELECT nav_id FROM AGroupNavbarRels WHERE agroup_id = :groupId`, {
      type: QueryTypes.SELECT,
      logging: false,
      replacements: {
        groupId
      }
    });

    return result;
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
  getAllRightsAndNavbars: async function () {
    const result = {};
    result.rights = await Right.findAll({ attributes: ["id", "name"] });
    result.navbars = await Navbar.findAll({ attributes: ["id", "name"], where: { parent_id: {[Op.is]: null}} });
    return result;
  },
  getNavbars: async (name, givenOffset) => {
      let query = `SELECT * FROM Navbars`;
      let countQuery = `SELECT COUNT(*) as count FROM Navbars`;
      const result = {};
      const replacements = {};

      let offset = 0;

      if (givenOffset && !isNaN(parseInt(givenOffset))) {
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

      query += " LIMIT 15 OFFSET :offset";
      replacements.offset = offset;

      result.navbars = await sequelize.query(query, {
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
  addNavbarAGroupRel: async (nav_id, agroup_id) => {
      return await AGroupNavbarRel.create({
          nav_id,
          agroup_id
      }, {
          logging: false
      });
  },
  removeNavbarAGroupRel: async (nav_id, agroup_id) => {
      return await AGroupNavbarRel.destroy({
          where: {
              nav_id,
              agroup_id
          },
          logging: false
      });
  }
};
