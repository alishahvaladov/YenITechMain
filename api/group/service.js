const { QueryTypes } = require("sequelize");
const { Group, sequelize, DeptGroupRel } = require("../../db_config/models");

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
    },
    addDeptGroupRels: (data, cb) => {
        DeptGroupRel.create({
            department_id: data.department_id,
            group_id: data.group_id
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        })
    },
    checkIfDepartmentExists: async (id) => {
        return await sequelize.query(`
            SELECT * FROM Departments
            WHERE id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        })
    }
}