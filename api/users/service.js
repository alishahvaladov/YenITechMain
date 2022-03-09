const { User, sequelize} = require("../../db_config/models");
const {Op, QueryTypes, where} = require("sequelize");

module.exports = {
    getUser: async (id) => {
        return await sequelize.query(`
            SELECT usr.id, usr.username, usr.email, usr.role, emp.first_name, emp.last_name, emp.father_name FROM Users as usr
            LEFT JOIN Employees as emp ON usr.emp_id = emp.id
            WHERE usr.id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    updatePassword: (data, cb) => {
        User.update({
            password: data.password,
            active_status: 0
        }, {
            where: {
                id: data.id
            },
            logging: false
        }).then(res => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    }
}