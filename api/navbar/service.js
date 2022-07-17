const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../db_config/models");

module.exports = {
    getNavs: async (role) => {
        return await sequelize.query(`
            SELECT nvbs.* FROM Navbars AS nvbs
            LEFT JOIN RoleNavbarRels AS rnr ON nvbs.id = rnr.navbar_id
            WHERE rnr.role_id = :role
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                role
            }
        });
    }
}