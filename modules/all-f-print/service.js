const { sequelize } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    getFPrints: async () => {
        return await sequelize.query(`SELECT fp.*, emp.first_name, emp.last_name, emp.father_name FROM FPrints as fp LEFT JOIN Employees as emp ON fp.emp_id = emp.id`, {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    getNoFPrints: async () => {
        return await sequelize.query(`SELECT nfp.*, emp.first_name, emp.last_name, emp.father_name FROM NoFPrints as nfp LEFT JOIN Employees as emp ON nfp.emp_id = emp.id`, {
            type: QueryTypes.SELECT,
            logging: false
        });
    }
}