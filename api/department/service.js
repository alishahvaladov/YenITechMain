const { sequelize, ProjDeptRel, Department } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    getProjectsForDepartments: async () => {
        return await sequelize.query(`
            SELECT * FROM Projects
            WHERE deletedAt IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
    },
    addDepartment: (data, cb) => {
        Department.create({
            name: data.name,
            user_id: data.user_id
        }, {
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        }) 
    },
    addProjDeptRel: (data, cb) => {
        ProjDeptRel.create({
            project_id: data.project_id,
            department_id: data.department_id
        }, {
            logging: false
        }).then((result) => {
            cb(null, result);  
        }).catch((err) => {
            cb(err);
        })
    },
    checkIfProjectExists: async (id) => {
        return await sequelize.query(`
            SELECT * FROM Projects
            WHERE deletedAt IS NULL
            AND id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    getDepartmentsByProject: async (projectId) => {
        return await sequelize.query(`
            SELECT dept.* FROM Departments as dept
            LEFT JOIN ProjDeptRels as pdr ON pdr.department_id = dept.id
            WHERE dept.deletedAt IS NULL
            AND pdr.project_id = :projectId
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                projectId
            }
        });
    },
    getAllDepartments: async (offset) => {
        const result = {};
        
        const departments = await sequelize.query(`
            SELECT id, name FROM Departments
            WHERE deletedAt IS NULL
            LIMIT 15 OFFSET :offset
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                offset
            }
        });

        const count = await sequelize.query(`
            SELECT COUNT(*) as count FROM Departments
            WHERE deletedAt IS NULL
        `, {
            type: QueryTypes.SELECT,
            logging: false,
        });

        result.departments = departments;
        result.count = count;
        return result;
    }
}