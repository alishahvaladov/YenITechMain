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
        return await sequelize.query(`SELECT dept.name as deptName, proj.name as projName, pos.name as posName, emp.first_name, emp.last_name, emp.father_name, emp.phone_number FROM Employees as emp 
                                      LEFT JOIN Departments as dept ON emp.department = dept.id 
                                      LEFT JOIN Projects as proj ON emp.project_id = proj.id
                                      LEFT JOIN Positions as pos ON emp.position_id = pos.id
                                      WHERE emp.id = :id`, {
           type: QueryTypes.SELECT,
           logging: false,
           replacements: {
               id: id
           }
        });
    }
}