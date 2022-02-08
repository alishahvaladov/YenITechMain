const { sequelize, FPrint, UnapprovedFPrints } = require("../../db_config/models");
const { QueryTypes} = require("sequelize");

module.exports = {
    getFPrints: async () => {
        return await sequelize.query(`SELECT fp.*, emp.first_name, emp.last_name, emp.father_name, proj.name as projName, dept.name as deptName, pos.name as posName FROM Employees as emp LEFT JOIN FPrints as fp ON emp.id = fp.emp_id
                                        LEFT JOIN Projects as proj ON emp.project_id = proj.id
                                        LEFT JOIN Departments as dept ON emp.department = dept.id
                                        LEFT JOIN Positions as pos ON emp.position_id = pos.id
                                        WHERE fp.f_print_time IS NOT NULL AND emp.deletedAt IS NULL`, {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    findEmpFromLogix: async (name, tabelNo = null) => {
        if (tabelNo !== null) {
            return await sequelize.query(`
            SELECT * from LogixDBs where name = :name AND tabel_no = :tabel_no
        `, {
                type: QueryTypes.SELECT,
                logging: false,
                replacements: {
                    name: name,
                    tabel_no: tabelNo
                }
            });
        } else {
            return await sequelize.query(`
            SELECT * from LogixDBs where name = :name
        `, {
                type: QueryTypes.SELECT,
                logging: false,
                replacements: {
                    name: name,
                    tabel_no: tabelNo
                }
            });
        }
    },
    addLogixDataToDB: (data, cb) => {
        FPrint.create({
            user_id: data.user_id,
            emp_id: data.emp_id,
            f_print_date: data.f_print_date,
            f_print_time: data.f_print_time
        }, {
            logging: false
        }).then((logixData) => {
            cb(null, logixData);
        }).catch((err) => {
            console.log(err);
            cb(err);
        })
    },
    addUnknownEmpsToDB: (data, cb) => {
        UnapprovedFPrints.create({
            name: data.name,
            f_print_time: data.f_print_time,
            tabel_no: data.tabel_no
        }, {
            logging: false
        }).then((insert) => {
            cb(null, insert);
        }).catch((err) => {
           cb(err);
        });
    }
}