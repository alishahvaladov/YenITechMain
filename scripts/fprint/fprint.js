const { sequelize, FPrint } = require("../../db_config/models");
const { QueryTypes } = require("sequelize");

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
            console.log(res);
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