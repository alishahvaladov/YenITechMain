const { getFines, getSalary, getSalaryByMonthByEmpID, getTimeOffs } = require("./service");

module.exports = {
    calculateSalary: async (req, res) => {
        const empSalary = await getSalary();
        empSalary.forEach(async (salary) => {
            const emp_id = salary.emp_id;
            const monthLySalaries = await getSalaryByMonthByEmpID(emp_id);
            const fines = await getFines(emp_id);
            const timeOffs = await getTimeOffs(emp_id);
            const gross = salary.gross;
            const unofficialNet = salary.unofficial_net;
            let calculatedSalary, dsmfTax, unempTax, healthTax, fine;
            let totalTimeOffCost = 0;
            if(unofficialNet === null) {
                if(gross > 200) {
                    if (fines.fine_minute > 0) {
                        fine = (gross / 1000) * parseInt(fines.fine_minute);
                    } else {
                        fine = 0;
                    }
                    if (timeOffs.length > 0) {
                        timeOffs.forEach(timeOff => {
                            let timeOffStart = timeOff.timeoff_start_date.split("-");
                            let timeOffEnd = timeOff.timeoff_end_date.split("-");
                            const monthsLength = monthLySalaries.length;
                            let totalMonthSalary = 0;
                            if(timeOff.timeoff_type === 2) {
                                monthLySalaries.forEach(salaryByMonth => {
                                    totalMonthSalary += parseInt(salaryByMonth.salary_cost);
                                });
                            }
                            const costForADay = totalMonthSalary / monthsLength / 30.4;
                            totalTimeOffCost += (parseInt(timeOffEnd[2]) - parseInt(timeOffStart[2])) * costForADay
                        });
                        console.log(totalTimeOffCost.toFixed(2));
                    }
                    dsmfTax = ((gross - 200) * 10 / 100) + 6;
                    unempTax = gross * 0.5 / 100;
                    healthTax = gross * 2 / 100;
                    calculatedSalary = gross - (dsmfTax + unempTax + healthTax);
                } else {
                    dsmfTax = gross * 3 / 100;
                    unempTax = gross * 0.5 / 100;
                    healthTax = gross * 2 / 100;
                    calculatedSalary = gross - (dsmfTax + unempTax + healthTax);
                }
            }
        });
    }
}