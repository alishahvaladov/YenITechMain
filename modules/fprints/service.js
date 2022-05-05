const { sequelize, FPrintDraft, UnapprovedFPrints, ForgottenFPrints, FPrint } = require("../../db_config/models");
const { QueryTypes} = require("sequelize");
const date = new Date();
let month = date.getMonth();

module.exports = {
    getFPrints: async () => {
        return await sequelize.query(`SELECT fp.*, emp.first_name, emp.last_name, emp.father_name, proj.name as projName, dept.name as deptName, pos.name as posName FROM Employees as emp LEFT JOIN FPrintDrafts as fp ON emp.id = fp.emp_id
                                        LEFT JOIN Projects as proj ON emp.project_id = proj.id
                                        LEFT JOIN Departments as dept ON emp.department = dept.id
                                        LEFT JOIN Positions as pos ON emp.position_id = pos.id
                                        WHERE fp.f_print_time IS NOT NULL AND emp.deletedAt IS NULL`, {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    getFPrintsByDate: async (emp_id, date) => {
        month += 1;
        return await sequelize.query(`SELECT DISTINCT fp.user_id, fp.emp_id, fp.f_print_date, fp.f_print_time, emp.first_name, emp.last_name, emp.father_name, proj.name as projName, dept.name as deptName, pos.name as posName FROM Employees as emp 
                                        LEFT JOIN FPrintDrafts as fp ON emp.id = fp.emp_id
                                        LEFT JOIN Projects as proj ON emp.project_id = proj.id
                                        LEFT JOIN Departments as dept ON emp.department = dept.id
                                        LEFT JOIN Positions as pos ON emp.position_id = pos.id
                                        WHERE fp.f_print_time IS NOT NULL AND emp.deletedAt IS NULL
                                        AND MONTH(fp.f_print_date) = 9
                                        AND DAY(fp.f_print_date) = :date
                                        AND emp.id = :emp_id
                                        AND emp.deletedAt IS NULL
                                        ORDER BY f_print_time ASC`, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                month,
                emp_id,
                date
            }
        });
    },
    getEmployeesIDsAndShiftTimes: async () => {
        return await sequelize.query(`SELECT id, shift_start_t, shift_end_t FROM Employees WHERE position_id != 17`, {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    addForgottenFPrintsToDB: (data, cb) => {
        ForgottenFPrints.create({
            emp_id: data.emp_id,
            f_print_date: data.f_print_date,
            f_print_time_entrance: data.f_print_time_entrance,
            f_print_time_exit: data.f_print_time_exit
        }, {
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
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
        FPrintDraft.create({
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
    },
    moveFromDraftToOrigin: () => {
        const getDrafts = async () => {
            const fpData = await sequelize.query(`
                    SELECT 'FPrintDrafts' AS "set", fpd.*
                    FROM FPrintDrafts fpd
                    WHERE ROW(fpd.emp_id, fpd.f_print_date, fpd.f_print_time) 
                    NOT IN (SELECT emp_id, f_print_date, f_print_time FROM FPrints)
            `, {
                type: QueryTypes.SELECT,
                logging: false
            });
            return fpData;
        }
        
        const moveOrigin = async () => {
            const fpData = await getDrafts();
            for (let i = 0; i < fpData.length; i++) {
                FPrint.create({
                    user_id: fpData[i].user_id,
                    emp_id: fpData[i].emp_id,
                    f_print_date: fpData[i].f_print_date,
                    f_print_time: fpData[i].f_print_time
                }, {
                    logging: false
                }).then((res) => {
                    console.log("FPrintDraftData Moved To Origin");
                }).catch((err) => {
                    console.log(err);
                });
            }
            await sequelize.query(`
                DELETE FROM FPrintDrafts
            `, {
                logging: false,
                type: QueryTypes.DELETE
            });
        }

        moveOrigin();
    }
}