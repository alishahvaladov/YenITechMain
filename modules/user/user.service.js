const { User, sequelize} = require("../../db_config/models");
const {Op, QueryTypes, where} = require("sequelize");

module.exports = {
    renderRegister: async (req, res) => {
        return await sequelize.query(`SELECT emp.id as empID, emp.first_name as empName, emp.last_name as empLName, emp.father_name as empFName, usr.* 
                                    FROM Employees as emp 
                                    LEFT JOIN Users as usr ON emp.id = usr.emp_id 
                                    WHERE usr.emp_id IS NULL OR (usr.emp_id IS NULL AND usr.deletedAt IS NOT NULL)`, {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    registerUser: (data, cb) => {
        User.create({
            emp_id: data.emp_id,
            username: data.username,
            password: data.password,
            email: data.email,
            role: data.role,
            active_status: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }, {
            logging: false
        }).then(() => {
            return cb();
        }).catch((err) => {
            console.log(err);
            return cb(err);
        });
    },
    deleteUser: (data, cb) => {
        User.update({
            deleted_by: data.deleted_by
        }, {
            where: {
                id: data.id
            }
        }).then((result) => {
            User.destroy({
                where: {
                    id: data.id,
                    role: {
                        [Op.ne]: 1
                    }
                },
                logging: false
            }).then((user) => {
                cb(null, user);
            }).catch((err) => {
                return cb(err);
            });
        }).catch((err) => {
            cb(err);
        })
    },
    getUsers: async () => {
        return await sequelize.query(`SELECT usr.*, emp.first_name, emp.last_name, emp.father_name 
                                    FROM Users as usr
                                    LEFT JOIN Employees as emp ON usr.emp_id = emp.id
                                    WHERE usr.deletedAt IS NULL AND usr.role != 1`, {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    getUser: async (id) => {
        return await sequelize.query(`
            SELECT usr.id, usr.username, usr.email, usr.role, emp.first_name, emp.last_name, emp.father_name FROM Users as usr
            LEFT JOIN Employees as emp ON usr.emp_id = emp.id
            WHERE usr.emp_id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        })
    },
    updateUser: (id, data, cb) => {
        User.update({
            emp_id: data.emp_id,
            username: data.username,
            email: data.email,
            role: data.role
        }, {
            where: {
                id: id,
                role: {
                    [Op.ne]: 1
                }
            },
            logging:false
        }).then((result) => {
            if(result) {
                console.log(result);
                cb(null, result)
            }
        }).catch((err) => {
            if(err) {
                console.log(err);
                cb(err);
            }
        })
    },
    activateUser: async (id, password) => {
        User.update({
            password,
            active_status: 1
        }, {
            where: {
                id
            }
        }).then((res) => {
            console.log(res);
        });
    },
    forgotPassword: (userInput, password, cb) => {
        User.findOne({
            where: {
                [Op.or]: [{username: userInput}, {email: userInput}]
            }
        }).then(res => {
            let result = res.dataValues;
            User.update({
                password,
                active_status: 0
            }, {
                where: {
                    id: result.id
                }
            }).then(r => {
                console.log(r);
            });
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    },
   
}