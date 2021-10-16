const { User, sequelize} = require("../../db_config/models");
const {Op, QueryTypes} = require("sequelize");

module.exports = {
    renderRegister: async (req, res) => {
        return await sequelize.query("SELECT emp.id, emp.first_name, emp.last_name, emp.father_name, usr.* FROM Employees as emp LEFT JOIN Users as usr ON emp.id = usr.emp_id WHERE usr.emp_id IS NULL", {
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
    deleteUser: (id, cb) => {
        console.log("User ID is: " + id);
        User.destroy({
            where: {
                id: id,
                role: {
                    [Op.ne]: 1
                }
            },
            logging: false
        }).then((user) => {
            console.log("User: " + user);
            cb(null, user);
        }).catch((err) => {
            cb(err);
        })
    },
    getUsers: (cb) => {
        User.findAll({
            where: {
                role: {
                    [Op.ne]: 1
                }
            },
            logging: false
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err)
        });
    },
    getUser: (id, cb) => {
        User.findOne({
            where: {
                id: id,
                role: {
                    [Op.ne]: 1
                }
            },
            logging: false
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
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
    }
}