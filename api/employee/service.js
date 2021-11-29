const { sequelize } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    getDepartment: async (id) => {
        return await sequelize.query("SELECT dept.id, dept.name FROM Departments as dept LEFT JOIN DepartmentPositions as deptpos ON deptpos.dep_id = dept.id WHERE deptpos.proj_id = :id GROUP BY dept.id", {
            replacements: { id: id },
            type: QueryTypes.SELECT
        });
    },
    getPosition: async (deptID, projID) => {
        return await sequelize.query("SELECT pos.id, pos.name FROM Positions as pos LEFT JOIN DepartmentPositions as deptpos ON deptpos.pos_id = pos.id WHERE deptpos.proj_id = :projID AND deptpos.dep_id = :deptID GROUP BY pos.id;", {
            type: QueryTypes.SELECT,
            replacements: {
                projID: projID,
                deptID, deptID
            }
        })
    },
    getEmployee: async (id) => {
        let empRes =  await sequelize.query(`SELECT emp.*, pos.name as posName, proj.name as projName, dept.name as deptName FROM Employees as emp
                                    LEFT JOIN Positions as pos ON pos.id = emp.position_id
                                    LEFT JOIN Projects as proj ON proj.id = emp.project_id
                                    LEFT JOIN Departments as dept ON dept.id = emp.department
                                    WHERE emp.id = :id`, {
           type: QueryTypes.SELECT,
           logging: false,
           replacements: {
               id: id
           }
        });
        let posRes = await sequelize.query(`SELECT * FROM Positions`, {
            logging: false,
            type: QueryTypes.SELECT
        });
        let projRes = await sequelize.query(`SELECT * FROM Projects`, {
            logging: false,
            type: QueryTypes.SELECT
        });
        let deptRes = await sequelize.query(`SELECT * FROM Departments`, {
            logging: false,
            type: QueryTypes.SELECT
        });
        let result = {};
        result.empRes = empRes;
        result.posRes = posRes;
        result.projRes = projRes;
        result.deptRes = deptRes;

        return result;
    },
    getEmpCount: async () => {
      return await sequelize.query('SELECT COUNT(*) as empCount FROM Employees', {
          logging: false,
          type: QueryTypes.SELECT
      });
    },
    empRenderPage: async () => {
        return await sequelize.query(`
            SELECT emp.*, pos.name as posName, dept.name as deptName, proj.name as projName FROM Employees as emp
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Departments as dept ON emp.department = dept.id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            WHERE emp.deletedAt IS NULL
            ORDER BY emp.createdAt DESC
            LIMIT 15 OFFSET 0
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
    },
    empRenderByPage: async (offset) => {
        return await sequelize.query(`
            SELECT emp.*, pos.name as posName, proj.name as projName, dep.name as deptName from Employees as emp
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Departments as dep ON emp.department = dep.id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            ORDER BY emp.createdAt DESC
            LIMIT 15 OFFSET :offset
        `, {
            logging: false,
            replacements: {
                offset
            },
            type: QueryTypes.SELECT
        })
    }
}