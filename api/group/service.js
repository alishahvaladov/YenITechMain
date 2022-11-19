const { QueryTypes } = require("sequelize");
const { Group, sequelize } = require("../../db_config/models");

module.exports = {
    addGroup: (data, cb) => {
        Group.create(data, {
            logging: false
        }).then((res) => {
            cb(null, res)
        }).catch((err) => {
            cb(err);
        });
    },
    getDepartmentsForGroups: async () => {
        return sequelize.query(`
            SELECT * FROM Departments
            WHERE deletedAt IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
    },
    getGroups: async (data) => {
        const replacements = {};
        let query = 
            "SELECT * FROM `Groups`";

        if (data.qName && data.qName !== "") {
            query += "name like :qName"
            replacements.qName = `%${data.qName}%`
        }

        query += "LIMIT 15 OFFSET :offset";

        replacements.offset = data.offset;

        return sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
    }
}