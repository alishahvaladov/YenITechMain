const { Employee, Salary, NoFPrint, FPrint, Fine } = require("../../db_config/models");

module.exports = {
    calculate: (cb) => {
        Employee.findAll({
            attributes: ['id', 'first_name', 'last_name', 'father_name']
        }).then((id) => {
            let employer = [];
            let results = {};
                for (let i = 0; i < id.length; i++) {
                let empId = id[i].dataValues.id;

                    Salary.findOne({
                        where: {
                            emp_id: empId
                        }
                    }).then((result) => {
                        let tax = 0;
                        if (parseInt(result.dataValues.gross) > 200) {
                            tax = ((parseInt(result.dataValues.gross) - 200) * parseInt(result.dataValues.dsmf) / 100) + (parseInt(result.dataValues.gross) * parseInt(result.dataValues.h_insurance) / 100) + (parseInt(result.dataValues.gross) * parseFloat(result.dataValues.unemployment) / 100)
                        } else {
                            tax = ((parseInt(result.dataValues.gross)) * 3 / 100) + parseInt(result.dataValues.gross) * parseInt(result.dataValues.h_insurance) / 100 + parseInt(result.dataValues.gross) * parseFloat(result.dataValues.unemployment) / 100
                        }

                        if (parseInt(result.dataValues.unofficial_net)) {
                            results.net = result.dataValues.unofficial_net;
                        } else if (result.dataValues.unofficial_pay) {
                            results.net = parseInt(result.dataValues.gross) - tax + parseInt(result[0].dataValues.unofficial_pay);
                        } else {
                            results.net = parseInt(result.dataValues.gross) - tax;
                        }
                        results.name = id[i].dataValues.first_name + ' ' + id[i].dataValues.last_name + ' ' + id[i].dataValues.father_name;
                        employer.push({dataValues: results});
                    });
                }
                cb(null, employer);
        }).catch((err) => {
            cb(err);
        })
    }
}
