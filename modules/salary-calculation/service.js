const { Employee, Salary, NoFPrint, FPrint, Fine, TimeOffRequest } = require("../../db_config/models");
const { sequelize } = require("../../db_config/models/index");
const {QueryTypes, Op} = require("sequelize");
const date = new Date();
const year = date.getFullYear();
let month = date.getMonth() + 1;
if (month.toString().length === 2) {
    month = month.toString();
}  else {
    month = "0" + month.toString();
}

module.exports = {
    calculate: (cb) => {
        let rawQuery = async () => {
            return await sequelize.query("SELECT emp.id, emp.first_name, emp.last_name, emp.father_name, salary.emp_id, salary.unofficial_net, salary.unofficial_pay, " +
                "salary.gross FROM Employees as emp LEFT JOIN Salaries as salary on emp.id = salary.emp_id", {
                type: QueryTypes.SELECT,
                logging: false
            });
        }
        rawQuery().then(result => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        })
    },
    getFPrintCount: async () => {
        return await sequelize.query("SELECT COUNT(fp.emp_id) as cDays, emp.id, emp.first_name, emp.last_name, emp.father_name, emp.FIN, emp.working_days" +
            " FROM Employees as emp " +
            "LEFT JOIN FPrints as fp ON fp.emp_id = emp.id GROUP BY emp.id", {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    findFPrintByEmpId: (emp_id, cb) => {
        FPrint.findAll({
            where: {
                emp_id: emp_id
            },
            logging: false
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    },
    findSalaryByEmpId: async (emp_id) => {
        return await Salary.findAll({
            where: {
                emp_id
            },
            logging: false
        });
        //     .then((result) => {
        //     cb(null, result);
        // }).catch((err) => {
        //     cb(err);
        // });
    },
    findTimeOff: async (emp_id) => {
        return await sequelize.query("SELECT * FROM TimeOffRequests as f WHERE f.timeoff_start_date LIKE :date AND emp_id = :emp_id", {
            type: QueryTypes.SELECT,
            replacements: {
                date: `${year}-${month}%`,
                emp_id: emp_id
            }
        });
    },
    findTimeOffByCreateTime: async (day) => {
        return await sequelize.query("SELECT * FROM FPrints WHERE createdAt = :date", {
            type: QueryTypes.SELECT,
            replacements: {
                date: `${year}-${month}-${day}`
            }
        });
    }
}
