const { sequelize,  } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");


module.exports = {
    getTimeOffs: async () => {
        return await sequelize.query(`
            SELECT toff.*, emp.first_name, emp.last_name, emp.father_name FROM TimeOffRequests as toff
            LEFT JOIN Employees as emp ON toff.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
        `, {
            type: QueryTypes.SELECT,
            logging: false
        });
    }
}