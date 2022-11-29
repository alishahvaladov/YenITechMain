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
    },
    getAllGroupsByDepartment: async (department_id) => {
        let query = "SELECT g.* FROM `Groups` as g";
        query += `
            LEFT JOIN DeptGroupRels as dgr ON g.id = dgr.group_id
            WHERE dgr.department_id = :department_id
        `
        return await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                department_id
            }
        });
    },
    getGroupsForEdit: async (id) => {
        const result = {};
        const replacements = {};

        let departmentQuery = "SELECT * FROM Departments";
        let relationQuery = `
            SELECT * FROM DeptGroupRels
            WHERE group_id = :id
        `;

        result.groupName = await sequelize.query("SELECT name FROM `Groups` WHERE id = :id", {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });

        result.groupName = result.groupName[0].name;

        result.departments = await sequelize.query(departmentQuery, {
            logging: false,
            type: QueryTypes.SELECT
        });

        result.deptByGroups = await sequelize.query(relationQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });

        return result;
    },
    insertDeptGroupRel: async (data) => {
        return await DeptGroupRel.create(data);
    },
    deleteDeptGroupRel: async (data) => {
        return await DeptGroupRel.destroy({where: data});
    },
    updateGroupName: async (groupName, id) => {
        return await Group.update({
            name: groupName
        }, {
            where: {
                id
            }
        });
    } 
}