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
    getAllDepartments: async (offset, body) => {
        const result = {};
        const replacements = {};

        let query = `
            SELECT id, name FROM Departments
            WHERE deletedAt IS NULL
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM Departments
            WHERE deletedAt IS NULL
        `;

        if (body.qName && body.qName !== "") {
            query += `
                AND name like :qName
            `;
            countQuery += `
                AND name like :qName
            `;
            replacements.qName = `%${body.qName}%`
        }

        query += `
            LIMIT 15 OFFSET :offset
        `;

        replacements.offset = offset

        const departments = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements
        });

        const count = await sequelize.query(countQuery, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements
        });

        result.departments = departments;
        result.count = count;
        return result;
    },
    getDepartmentByID: async (id) => {
        const result = {};
        
        const deptQuery = `
            SELECT name FROM Departments
            WHERE deletedAt IS NULL
            AND id = :id
        `;
        const projDeptRelQuery = `
            SELECT pdr.* FROM Departments as dept
            LEFT JOIN ProjDeptRels AS pdr ON pdr.department_id = dept.id
            WHERE dept.deletedAt IS NULL
            AND dept.id = :id
        `;
        const projectsQuery = `
            SELECT id, name FROM Projects
            WHERE deletedAt IS NULL
        `;

        result.departmentName = await sequelize.query(deptQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });

        result.projectsForDepartment = await sequelize.query(projDeptRelQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });

        result.projects = await sequelize.query(projectsQuery, {
            logging: false,
            type: QueryTypes.SELECT
        });

        return result;
    },
    updateDepartmentName: (data, cb) => {
        Department.update({
            name: data.name
        }, {
            where: {
                id: data.id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    getProjDeptRel: async (data) => {
        return await sequelize.query(`
            SELECT * FROM ProjDeptRels
            WHERE project_id = :project_id
            AND department_id = :department_id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                project_id: data.project_id,
                department_id: data.department_id
            }
        });
    },
    insertProjDeptRel: (data, cb) => {
        ProjDeptRel.create({
            project_id: data.project_id,
            department_id: data.department_id
        }, {
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        })
    },
    deleteProjeDeptRel: (data, cb) => {
        ProjDeptRel.destroy({
            where: {
                project_id: data.project_id,
                department_id: data.department_id
            },
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    getDepartmentsForExport: async (body) => {
        const replacements = {};

        let query = `
            SELECT id, name FROM Departments
            WHERE deletedAt IS NULL
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM Departments
            WHERE deletedAt IS NULL
        `;

        if (body.qName && body.qName !== "") {
            query += `
                AND name like :qName
            `;
            countQuery += `
                AND name like :qName
            `;
            replacements.qName = `%${body.qName}%`
        }

        return await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
    }
}