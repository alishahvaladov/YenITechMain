const { NoFPrint, Employee } = require("../../db_config/models");
const {Op, Sequelize} = require("sequelize");
const moment = require("moment/moment");



module.exports = {
    renderAdd: (cb) => {
        Employee.findAll({
            attributes: ['id', 'first_name', 'last_name', 'father_name', 'sex']
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        })
    },
    addFPrint: (data, cb) => {
        NoFPrint.create({
            create_user_id: data.create_user_id,
            emp_id: data.emp_id,
            enter_sign_time: data.enter_sign_time,
            date: data.enter_sign_date
        }, {
            logging: false
        }).then((print) => {
            cb(null, print);
        }).catch((err) => {
            cb(err);
        });
    },
    getNoFPrints: (cb) => {
        NoFPrint.findAll({
            where: {
                createdAt: {
                    [Op.gt]: moment().subtract(1, 'days').toDate()
                }
            },
            attributes: ['id', 'enter_sign_time', 'leave_sign_time', 'date'],
            include: [{
                model: Employee,
                where: {"emp_id": Sequelize.col('emp.id')},
                attributes: ['id', 'first_name', 'last_name', 'father_name'],
                as: "emp"
            }],
            order: [['leave_sign_time', 'DESC']]
        }).then((result) => {
            cb(null, result);
        }).catch(err => {
            cb(err);
        });
    },
    update: (data, user_id, cb) => {
        NoFPrint.update({
            update_user_id: user_id,
            leave_sign_time: data.leave_sign_time
        }, {
            where: {
                id: data.id
            }
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    }
}