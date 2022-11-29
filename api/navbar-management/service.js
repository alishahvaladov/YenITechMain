const { QueryTypes } = require("sequelize");
const { sequelize, AGroupNavbarRel } = require("../../db_config/models");

module.exports = {
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
    getGroupsForNav: async (id) => {
        const result = {};
        result.groups = await sequelize.query("SELECT * FROM AccessGroups", {
            logging: false,
            type: QueryTypes.SELECT
        });
        result.activeGroups = await sequelize.query(`
            SELECT agnr.nav_id, agnr.agroup_id FROM AccessGroups as ag
            LEFT JOIN AGroupNavbarRels as agnr ON agnr.nav_id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
        const navbarName = await sequelize.query("SELECT name FROM Navbars WHERE id = :id", {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
        result.navbarName = navbarName[0].name;
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
}