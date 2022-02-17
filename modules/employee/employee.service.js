const { Employee, EmployeeFileDirectory, LogixDB } = require("../../db_config/models");
const {Op, QueryTypes} = require("sequelize");
const {sequelize} = require("../../db_config/models/index");
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
            working_days: data.working_days,
            position_id: data.position_id,
            project_id: data.project_id
        }, {
            logging: false
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err); 
        })
    },
    addLogixDataToLogixDB: (data, cb) => {
        LogixDB.create({
            emp_id: data.emp_id,
            name: data.logix_name,
            tabel_no: data.tabel_no
        }, {
            logging: false
        }).then((result) => {
            cb(null, result);
        }).catch(err => {
            cb(err);
        });
    },
    getEmployees: async () => {
        return await sequelize.query(`SELECT emp.*, dp.name as depName, pj.name as pjName, ps.name as psName from Employees as emp 
        LEFT JOIN Departments as dp ON emp.department = dp.id
        Left JOIN Projects as pj ON emp.project_id = pj.id
        Left Join Positions as ps ON emp.position_id = ps.id
        WHERE emp.deletedAt IS NULL`, {
            type: QueryTypes.SELECT,
            logging: false
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
    getEmployee: async (id, cb) => {
        Employee.findOne({
            where: {
                id: id
            }
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        })
    },
    updateJEnd: (id, data, cb) => {
        Employee.update({
            j_end_date: data.j_end_date
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
    renderAddEmployeeForDept: async () => {
        return await sequelize.query("SELECT * FROM Departments", {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    renderAddEmployeeForPos: async () => {
        return await sequelize.query("SELECT * FROM Positions", {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    renderAddEmployeeForPj: async () => {
        return await sequelize.query("SELECT * FROM Projects", {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    getEmployeeRemoveModule: (id) => {
        return sequelize.query("SELECT * FROM Employees WHERE id = :id AND deletedAt IS NULL", {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {id: id}
        });
    },
    addFileNames: (data, cb) => {
        EmployeeFileDirectory.create({
                emp_id: data.emp_id,
                insert_user: data.user_id,
                uploaded_files: data.files
            }, {
                logging: false
            }
        ).then((files) => {
            cb(null, files);
        }).catch((err) => {
            cb(err);
        });
    },
    updateFileNames: (data, cb) => {
        EmployeeFileDirectory.update({
            update_user: data.user_id,
            uploaded_files: data.files
        }, {
            where: {
                emp_id: data.emp_id
            },
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
           cb(err);
        });
    },
    deleteEmpFiles: (data, cb) => {
        EmployeeFileDirectory.destroy({
            where: {
                emp_id: data.emp_id,
                delete_user: data.user_id
            },
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    checkIfEmpFileExists: (emp_id, cb) => {
        EmployeeFileDirectory.findOne({
            where: {
                emp_id
            },
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    checkIfEmpExists: (emp_id, cb) => {
        Employee.findOne({
            where: {
                id: emp_id
            },
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
           cb(err);
        });
    },
    getEmpProjName: (id) => {
        return sequelize.query(`
            SELECT pos.name FROM Employees as emp
            LEFT JOIN Projects as pos ON emp.position_id = pos.id
            WHERE emp.id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    uploadSalaryToDB: (data, cb) => {

    },
}