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
            SELECT usr.id, emp.first_name, emp.last_name, emp.father_name, usr.username, usr.email, usr.role FROM Users as usr
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
    },
    getDeletedUsers: async (data) => {
        let query = `
            SELECT usr.id, usr.username, usr.role, usr.updatedAt, usr.email, usr.deleted_by, emp.first_name, emp.last_name, emp.father_name FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            WHERE usr.deletedAt IS NOT NULL
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            WHERE usr.deletedAt IS NOT NULL
        `;
        const replacements = {};
        const result = {};
        if (data.qEmp !== "" && qEmp) {
            const qEmp = data.qEmp.split(" ");
            if(qEmp.length === 1) {
                query += `
                    AND (emp.first_name like :qEmp OR emp.last_name like :qEmp OR emp.father_name like :qEmp)
                `
                countQuery += `
                    AND (emp.first_name like :qEmp OR emp.last_name like :qEmp OR emp.father_name like :qEmp)
                `;
                replacements.qEmp = `%${qEmp[0]}%`
            }
            if (qEmp.length === 2) {
                query += `
                    AND ((emp.first_name like :qEmp AND emp.last_name like :qEmp2) OR (emp.first_name like :qEmp AND emp.father_name like :qEmp2) OR (emp.last_name like :qEmp AND emp.father_name like :qEmp2))
                `
                countQuery += `
                    AND ((emp.first_name like :qEmp AND emp.last_name like :qEmp2) OR (emp.first_name like :qEmp AND emp.father_name like :qEmp2) OR (emp.last_name like :qEmp AND emp.father_name like :qEmp2))
                `
                replacements.qEmp = `%${qEmp[0]}%`
                replacements.qEmp2 = `%${qEmp[1]}%`
            }
            if (qEmp.length === 3) {
                query += `
                    AND (emp.first_name like :qEmp AND emp.last_name like :qEmp2 AND emp.father_name like :qEmp3)
                `
                countQuery += `
                    AND (emp.first_name like :qEmp AND emp.last_name like :qEmp2 AND emp.father_name like :qEmp3)
                `
                replacements.qEmp = `%${qEmp[0]}%`
                replacements.qEmp2 = `%${qEmp[1]}%`
                replacements.qEmp3 = `%${qEmp[2]}%`
            }
        }
        if (data.qUsername !== "" && data.qUsername) {
            query += `
                AND usr.username like :qUsername
            `
            countQuery += `
                AND usr.username like :qUsername
            `
            replacements.qUsername = `%${data.qUsername}%`;
        }
        if (data.qEmail !== "" && data.qEmail) {
            query += `
                AND usr.email like :qEmail
            `
            countQuery += `
                AND usr.email like :qEmail
            `
            replacements.qEmail = `%${data.qEmail}%`;
        }
        if (data.role !== "" && data.role && !isNaN(parseInt(data.role))) {
            query += `
                AND usr.role = :role
            `
            countQuery += `
                AND usr.role = :role
            `
            replacements.role = parseInt(data.role);
        }

        query += `
            LIMIT :limit OFFSET :offset
        `;
        replacements.limit = parseInt(data.limit);
        replacements.offset = parseInt(data.offset);

        result.deletedUsers = await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
        result.deletedUsersCount = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });

        return result;
    },
    getDeleterUser: async (user_id) => {
        return await sequelize.query(`
            SELECT emp.first_name, emp.last_name, emp.father_name FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            WHERE usr.id = :user_id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                user_id
            }
        });
    }
}
