const { sequelize, Project } = require("../../db_config/models");
const { QueryTypes } = require("sequelize");

module.exports = {
    getProjects: async (offset) => {
        const result = {};

        const project = await sequelize.query(`
            SELECT pj.id, pj.name, pj.address, emp.first_name, emp.last_name, emp.father_name FROM Projects as pj
            LEFT JOIN Employees as emp ON emp.id = pj.project_manager_id
            WHERE pj.deletedAt IS NULL
            limit 15 offset :offset
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                offset
            }
        });

        const count = await sequelize.query(`
            SELECT COUNT(*) as count FROM Projects as pj
            LEFT JOIN Employees as emp ON emp.id = pj.project_manager_id
            WHERE pj.deletedAt IS NULL
        `, {
            type: QueryTypes.SELECT,
            logging: false,
        });

        result.projects = project;
        result.count = count;
        return result;
    },
    getProjectsForEmpForm: async (emp_id) => {
        return await sequelize.query(`
            SELECT proj.* FROM Projects as proj
            LEFT JOIN Employees as emp ON emp.project_id = proj.id
            WHERE emp.id = :emp_id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                emp_id
            }
        });
    },
    getProjectManagersAndParentProjects: async () => {
        const result = {};

        result.projectManagers = await sequelize.query(`
            SELECT id, first_name, last_name, father_name FROM Employees
            WHERE deletedAt IS NULL
        `, {
            logging :false,
            type: QueryTypes.SELECT
        });

        result.parentProjects = await sequelize.query(`
            SELECT id, name FROM Projects
            WHERE parent_id IS NULL
            AND deletedAt IS NULL
        `, {
            logging :false,
            type: QueryTypes.SELECT
        });

        return result;
    },
    getProjectById: async (project_id) => {
        return await sequelize.query(`
            SELECT * FROM Projects
            WHERE id = :project_id
            AND deletedAt IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                project_id
            }
        });
    },
    updateProject: (data, cb) => {
        Project.update({
            user_id: data.user_id,
            name: data.name,
            address: data.address,
            project_manager_id: data.project_manager_id,
            parent_id: data.parent_id
        }, {
            where: {
                id: data.project_id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    }
}