const { calculate, getFPrintCount, findFPrintByEmpId, findSalaryByEmpId, findTimeOff, findTimeOffByCreateTime} = require("./service");
const taxJson = require("../../config/config.json").tax;
const dsmf = taxJson.dsmf;
const h_insurance = taxJson.h_insurance;
const unemployment = taxJson.unemployment;
const dsmf_lt_200 = taxJson.dsmf_lt_200;
const dsmf_limit = taxJson.dsmf_limit;
const date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
let errors = [];
let monthDiff = (d1, d2) => {
    let months;
    months = (d2.getFullYear() - d1.getFullYear() * 12);
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}
let getSundays = (year, month) => {
    let day, counter, date;

    day = 1;
    counter = 0;
    date = new Date(year, month, day);
    while (date.getMonth() === month) {
        if(date.getDay() !== 0) {
            counter++;
        }
        day++;
        date = new Date(year, month, day);
    }
    return counter;
}
let findDayIsSunday = (year, month, day) => {
    let date = new Date(year, month, day);
    if(date.getDay() === 0) {
        return true;
    } else {
        return false;
    }

}
let nSalaryFunction = async (req, res, result, i) => {
    errors = [];
    try {
        const resultSalary = await findSalaryByEmpId(result[i].id);
        let gross, tax, UN, UP;
        let salaries = [];
        for (let j = 0; j < resultSalary.length; j++) {
            UN = parseInt(resultSalary[j].dataValues.unofficial_net);
            UP = parseInt(resultSalary[j].dataValues.unofficial_pay);
            gross = parseInt(resultSalary[j].dataValues.gross);
            if (gross > dsmf_limit) {
                tax = ((gross - dsmf_limit) * dsmf / 100 + 6) + (gross * h_insurance / 100) + (gross * unemployment / 100);
            } else {
                tax = (gross * dsmf_lt_200 / 100) + (gross * h_insurance / 100) + (gross * unemployment / 100);
            }
            if (UN) {
                result[i].net = UN;
            } else if (UP) {
                result[i].net = (gross - tax) + UP;
            } else {
                result[i].net = gross - tax;
            }
        }
        return result;
    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    fPrintCountCheck: async (req, res) => {
        let result;
        let timeOffs;
        try {
            result = await getFPrintCount();
            for (let i = 0; i < result.length; i++) {
                if (result[i].working_days === 77 && result[i].cDays >= getSundays(year, month)) {
                    await nSalaryFunction(req, res, result, i);
                } else if (result[i].working_days === 77 && result[i].cDays < getSundays(year, month)) {
                    try {
                        timeOffs = await findTimeOff(result[i].id);
                        if (timeOffs.length !== 0) {
                            for (let y = 0; y < timeOffs.length; y++) {
                                let timeOffStartDate = parseInt(timeOffs[y].timeoff_start_date.split('-')[2]);
                                let timeOffJobStartDate = parseInt(timeOffs[y].timeoff_job_start_date.split('-')[2]);
                                let countFPrint = 0;
                                for (let k = timeOffStartDate; k <= timeOffJobStartDate; k++) {
                                    try {
                                        let timeOffDayByDay = await findTimeOffByCreateTime(k);
                                        if(timeOffDayByDay && !findDayIsSunday(year, month, k)) {
                                            countFPrint++;
                                        }
                                        if (getSundays(year, month) - result[i].cDays == countFPrint) {
                                            let timeOffType = timeOffs[y].timeoff_type;
                                            if(timeOffType === 1) {
                                                try {
                                                    let salary = await findSalaryByEmpId(timeOffs[y].emp_id);
                                                    console.log(salary);
                                                } catch (err) {
                                                    console.log(err);
                                                }
                                            }
                                        }
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        } catch (err) {
            console.log(err);
            errors.push({msg: "There are some problems to get some employees' salary please contact System Admin"});
            if (req.user.role === 5) {
                return res.render("calculation-salary/table", {
                    errors,
                    hr: true
                });
            } else if (req.user.role === 1) {
                return res.render("calculation-salary/table", {
                    errors,
                    super_admin: true
                });
            }
        }
        console.log(timeOffs);
    }
}