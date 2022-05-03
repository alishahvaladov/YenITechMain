const { User, sequelize} = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

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
    },
    getAllUsers: async (offset) => {
        const result = {};

        const users = await sequelize.query(`
            SELECT emp.first_name, emp.last_name, emp.father_name, usr.username, usr.email, usr.role FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            WHERE emp.deletedAt IS NULL
            AND usr.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            AND usr.role != 1
            LIMIT 15 OFFSET :offset
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                offset
            }
        });


        const count = await sequelize.query(`
            SELECT COUNT(*) as count FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            WHERE emp.deletedAt IS NULL
            AND usr.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });

        result.users = users;
        result.count = count;
        return result;
    }
}
