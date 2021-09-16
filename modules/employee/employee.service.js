const { Employee } = require("../../db_config/models");
const {Op} = require("sequelize");
const date = new Date();
const day = date.getDate();
const month = date.getMonth();
const year = date.getFullYear();
let arr = [];
arr.push(year);
arr.push(month + 1);
arr.push(day);

module.exports = {
    addEmployee: (data, cb) => {
        Employee.create({
            user_id: data.user_id,
            first_name: data.first_name,
            last_name: data.last_name,
            father_name: data.father_name,
            sex: data.sex,
            dob: data.dob,
            q_address: data.q_address,
            y_address: data.y_address,
            SSN: data.SSN,
            FIN: data.FIN,
            phone_number: data.phone_number,
            home_number: data.home_number,
            shift_start_t: data.shift_start_t,
            shift_end_t: data.shift_end_t,
            j_start_date: data.j_start_date,
            dayoff_days_total: data.dayoff_days_total,
            department: data.department,
            position_id: data.position_id,
            project_id: data.project_id
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err); 
        })
    },
    getEmployees: (cb) => {
      Employee.findAll({
          attributes: ['id', 'first_name', 'last_name', 'father_name', 'sex', 'dob', 'phone_number', 'department', 'position_id', 'project_id', 'j_end_date']
      }).then((results) => {
          cb(null, results)
      }).catch((err) => {
          cb(err);
      });
    },
    deleteEmployee: (id, cb) => {
        console.log("ID is: " + id);
        Employee.destroy({
            where: {
                id: id
            }
        }).then((employee) => {
            console.log(employee);
            cb();
        }).catch((err) => {
            if (err) throw err;
            cb(err);
        });
    },
    updateEmployee: (id, data, cb) => {
        Employee.update({
            first_name: data.first_name,
            last_name: data.last_name,
            father_name: data.father_name,
            sex: data.sex,
            dob: data.dob,
            q_address: data.q_address,
            y_address: data.y_address,
            SSN: data.SSN,
            FIN: data.FIN,
            phone_number: data.phone_number,
            home_number: data.home_number,
            shift_start_t: data.shift_start_t,
            shift_end_t: data.shift_end_t,
            j_start_date: data.j_start_date,
            dayoff_days_total: data.dayoff_days_total,
            department: data.department,
            position_id: data.position_id,
            project_id: data.project_id
        }, {
            where: {
                id: id
            }
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        })
    },
    getEmployee: (id, cb) => {
        Employee.findOne({
            where: {
                id: id
            }
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        })
    }
}