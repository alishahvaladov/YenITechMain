const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../db_config/models");

module.exports = {
    getNavs: async (role) => {
        let query = "";
        if (parseInt(role) === 1) {
            query += `
                SELECT * FROM Navbars AS nvbs
           `;
        } else {
            query += `
                
            `
        }
        return await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                role
            }
        });
    }
}