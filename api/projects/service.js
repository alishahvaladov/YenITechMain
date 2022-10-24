const { sequelize, Project } = require("../../db_config/models");
const { QueryTypes } = require("sequelize");

module.exports = {
    getProjects: async (offset, body) => {
        const result = {};
        const replacements = {};
        let query = `
            SELECT pj.id, pj.name, pj.address, emp.first_name, emp.last_name, emp.father_name FROM Projects as pj
            LEFT JOIN Employees as emp ON emp.id = pj.project_manager_id
            WHERE pj.deletedAt IS NULL
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM Projects as pj
            LEFT JOIN Employees as emp ON emp.id = pj.project_manager_id
            WHERE pj.deletedAt IS NULL
        `;

        if(body.qName && body.qName !== "") {
            query += `
                AND pj.name like :qName
            `;
            countQuery += `
                AND pj.name like :qName
            `;
            replacements.qName = `%${body.qName}%`;
        }

        if(body.qAddress && body.qAddress !== "") {
            query += `
                AND pj.address like :qAddress
            `;
            countQuery += `
                AND pj.address like :qAddress
            `;
            replacements.qAddress = `%${body.qAddress}%`;
        }
        
        if (body.qEmployee && body.qEmployee !== "") {
            const splittedEmp = body.qEmployee.split(" ");
            if (splittedEmp.length === 1) {
                query += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee)
                `;
                countQuery += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
            }
            if (splittedEmp.length === 2) {
                query += `
                    AND ((emp.first_name like :qEmployee AND emp.last_name like :qEmployee2) OR (emp.first_name like :qEmployee AND emp.father_name like :qEmployee2) OR (emp.last_name like :qEmployee AND emp.father_name like :qEmployee2))
                `;
                countQuery += `
                    AND ((emp.first_name like :qEmployee AND emp.last_name like :qEmployee2) OR (emp.first_name like :qEmployee AND emp.father_name like :qEmployee2) OR (emp.last_name like :qEmployee AND emp.father_name like :qEmployee2))
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
            }
            if (splittedEmp.length === 3) {
                query += `
                    AND (emp.first_name like :qEmployee AND emp.last_name like :qEmployee2 AND emp.father_name like :qEmployee3)
                `;
                countQuery += `
                    AND (emp.first_name like :qEmployee AND emp.last_name like :qEmployee2 AND emp.father_name like :qEmployee3)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
                replacements.qEmployee3 = `%${splittedEmp[2]}%`;
            }
        }

        query += `
            limit 15 offset :offset
        `;

        replacements.offset = offset;
        
        const project = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements
        });

        const count = await sequelize.query(countQuery, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements
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
    },
    getProjectsForExport: async (body) => {
        const replacements = {};
        let query = `
            SELECT pj.id, pj.name, pj.address, emp.first_name, emp.last_name, emp.father_name FROM Projects as pj
            LEFT JOIN Employees as emp ON emp.id = pj.project_manager_id
            WHERE pj.deletedAt IS NULL
        `;

        if(body.qName && body.qName !== "") {
            query += `
                AND pj.name like :qName
            `;
            replacements.qName = `%${body.qName}%`;
        }

        if(body.qAddress && body.qAddress !== "") {
            query += `
                AND pj.address like :qAddress
            `;
            replacements.qAddress = `%${body.qAddress}%`;
        }
        
        if (body.qEmployee && body.qEmployee !== "") {
            const splittedEmp = body.qEmployee.split(" ");
            if (splittedEmp.length === 1) {
                query += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
            }
            if (splittedEmp.length === 2) {
                query += `
                    AND ((emp.first_name like :qEmployee AND emp.last_name like :qEmployee2) OR (emp.first_name like :qEmployee AND emp.father_name like :qEmployee2) OR (emp.last_name like :qEmployee AND emp.father_name like :qEmployee2))
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
            }
            if (splittedEmp.length === 3) {
                query += `
                    AND (emp.first_name like :qEmployee AND emp.last_name like :qEmployee2 AND emp.father_name like :qEmployee3)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
                replacements.qEmployee3 = `%${splittedEmp[2]}%`;
            }
        }

        return await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
    },
    addProject: (data, cb) => {
        Project.create({
            user_id: data.user_id,
            name: data.name,
            address: data.address,
            project_manager_id: data.project_manager_id,
            parent_id: data.parent_id
        }, {
            logging: false
        }).then((project) => {
            cb(null, project)
        }).catch(err => {
            cb(err);
        })
    },
}