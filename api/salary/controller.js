const { getFines, getSalary, getSalaryByMonthByEmpID, getTimeOffs, getEmployeeExperience, getSalariesByMonth, getMonthlyWorkingDays, addCalculatedGrossToDB, search, searchSalaryByMonts, getSalariesForExport, getSalaryByID, updateSalary, getSalariesForExportAll, getCalculatedSalary } = require("./service");
const jsDateF = new Date();
const month = jsDateF.getMonth();
const year = jsDateF.getFullYear();
const date = jsDateF.getDate();
const excelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

function weekends( m, y ) {
    let count = {};
    let satCount = 0;
    let sunCount = 0;
    var days = new Date( y,m + 1,0 ).getDate();
    for(var i = 1; i <= parseInt(days); i++){
        var newDate = new Date(y,m,i)
        if(newDate.getDay()==0){
            satCount++
        }
        if(newDate.getDay()==6){
            sunCount++
        }
    }
    count.satCount = satCount;
    count.sunCount = sunCount;

    return count;
}
function getSundays(startDate, endDate) {
    let start = startDate;
    let finish = endDate;
    const dayMilliseconds = 1000 * 60 * 60 * 24;
    let sundays = 0;
    while(start <= finish) {
        let day = start.getDay();
        if(day == 0) {
            sundays++
        }
        start = new Date(+start + dayMilliseconds);
    }
    return sundays;
}
function timeOffCalculation(timeOffs, monthLySalaries, emp_id, gross, montlyWorkingDays) {
    let totalTimeOffDaysVacation = 0;
    let totalTimeOffDaysSelfVacation = 0;
    let totalTimeOffDaysHealthVacation = 0;
    let timeOffTypes = {};
    let notAtWorkCost = 0;
    let weekendsBySunAndSat;
    let allDaysOfWork;
    let totalMonthSalary = 0;
    let monthsLength;
    if (date === 1) {
        weekendsBySunAndSat = weekends(month, year);
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        allDaysOfWork = parseInt(lastDayOfMonth) - parseInt(weekendsBySunAndSat.sunCount);
        daysOfWork = parseInt(lastDayOfMonth) - parseInt(weekendsBySunAndSat.sunCount) - parseInt(weekendsBySunAndSat.satCount);
    } else if (date > 27) {
        weekendsBySunAndSat = weekends(month + 1, year);
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        allDaysOfWork = parseInt(lastDayOfMonth) - parseInt(weekendsBySunAndSat.sunCount);
        daysOfWork = parseInt(lastDayOfMonth) - parseInt(weekendsBySunAndSat.sunCount) - parseInt(weekendsBySunAndSat.satCount);
    }

    if (monthLySalaries.length > 0) {
        monthsLength = monthLySalaries.length;
    } else {
        monthsLength = 1;
    }
    timeOffs.forEach(timeOff => {
        let timeOffStart = new Date(timeOff.timeoff_start_date);
        let timeOffEnd = new Date(timeOff.timeoff_end_date);
        const sundayCount = getSundays(timeOffStart, timeOffEnd);
        if(timeOff.timeoff_type === 1 && timeOff.status === 4) {
            var Difference_In_Time = timeOffEnd.getTime() - timeOffStart.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            const costForADay = parseInt(gross) / parseInt(allDaysOfWork); 
            if (sundayCount > 0) {
                Difference_In_Days = parseInt(Difference_In_Days) - sundayCount;
            }
            totalTimeOffDaysSelfVacation += (parseInt(Difference_In_Days) * costForADay);
            timeOffTypes.selfVacation = true;
        } else if(timeOff.timeoff_type === 2 && timeOff.status === 4) {
            let Difference_In_Time = timeOffEnd.getTime() - timeOffStart.getTime();
            let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            totalTimeOffDaysVacation += parseInt(Difference_In_Days);
            if (sundayCount > 0) {
                totalTimeOffDaysVacation - sundayCount;
            }
            timeOffTypes.vacation = true;
        } else if(timeOff.timeoff_type === 3 && timeOff.status === 4) {
            const monthlyWorkDays = montlyWorkingDays;
            const totalDays = 0;
            monthlyWorkDays.forEach(days => {
                totalDays += days.work_days;
            });
            let experience = getEmployeeExperience(emp_id);
            experience = experience[0].employee_experience_year;
            monthLySalaries.forEach(salaryByMonth => {
                totalMonthSalary += parseInt(salaryByMonth.salary_cost);
            });
            var Difference_In_Time = timeOffEnd.getTime() - timeOffStart.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            if (sundayCount > 0) {
                Difference_In_Days = Difference_In_Days - sundayCount;
            }
            timeOffTypes.healthVacation = true;
        }
    });
    if (timeOffTypes.vacation === true) {
        const atWorkDays = allDaysOfWork - totalTimeOffDaysVacation;
        const atWorkCost = gross / allDaysOfWork * atWorkDays;
        if(monthLySalaries.length > 0) {
            monthLySalaries.forEach(salaryByMonth => {
                totalMonthSalary += parseInt(salaryByMonth.salary_cost);
            });
        }
        const timeOffCost = totalMonthSalary / monthsLength / 30.4 * totalTimeOffDaysVacation;
        gross = atWorkCost + timeOffCost;
    }
    if(timeOffTypes.selfVacation === true) {
        const absentCost = gross / allDaysOfWork * totalTimeOffDaysSelfVacation;
        gross = gross - absentCost;
    }
    if (timeOffTypes.healthVacation === true) {
        gross = gross - notAtWorkCost;
    }
    return gross;
}


module.exports = {
    calculateSalary: async (req, res) => {
        const empSalary = await getSalary();
        empSalary.forEach(async (salary) => {
            const emp_id = salary.emp_id;
            const monthLySalaries = await getSalaryByMonthByEmpID(emp_id);
            const fines = await getFines(emp_id);
            const timeOffs = await getTimeOffs(emp_id);
            let limit;
            if (monthLySalaries.length > 11) {
                limit = 12;
            } else {
                limit = monthLySalaries.length;
            }
            const monthlyWorkDays = await getMonthlyWorkingDays(limit);
            const gross = salary.gross;
            const unofficialNet = salary.unofficial_net;
            let dsmfTax, unempTax, healthTax, fine;
            let calculatedGross;
            let net;
            if(gross > 200) {
                if (fines.length > 0 && fines[0].fine_minute > 0) {
                    fine = (gross / 1000) * parseInt(fines.fine_minute);
                }else {
                    fine = 0;
                }
                
                if (timeOffs.length > 0) {
                    calculatedGross = timeOffCalculation(timeOffs, monthLySalaries, emp_id, gross, monthlyWorkDays);
                } else {
                    calculatedGross = gross;
                }
                let data = {};
                let salaryDate;
                if (date === 1) {
                    salaryDate = new Date(year, month + 1, 0);
                } else {
                    salaryDate = new Date(year, month, 0);
                }
                data.emp_id = emp_id;
                data.salary_date = salaryDate;
                data.salary_cost = calculatedGross;

                addCalculatedGrossToDB(data, (err ,result) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({
                            success: false,
                            message: "An unkown error has been occurred"
                        });
                    }
                })

                dsmfTax = ((calculatedGross - 200) * 10 / 100) + 6;
                unempTax = calculatedGross * 0.5 / 100;
                healthTax = calculatedGross * 2 / 100;
                net = calculatedGross - dsmfTax - unempTax - healthTax;
                if (unofficialNet !== null || parseInt(unofficialNet) > 0) {
                    net += parseInt(unofficialNet);
                }
            } else {
                dsmfTax = gross * 3 / 100;
                unempTax = gross * 0.5 / 100;
                healthTax = gross * 2 / 100;
                net = gross - (dsmfTax + unempTax + healthTax);
            }
        });
        return res.end();
    },
    getSalaries: async (req, res) => {
        try {
            let offset = req.params.offset;
            if (parseInt(offset) !== 0) {
                offset = (parseInt(offset) - 1) * 15;
            } else {
                offset = 0;
            }
            const result = await getSalary(offset);
            res.send({
                result
            });
        } catch (err) {
            console.log(err);
            return res.send({
                success: false,
                message: "An unkown error has been occurred"
            });
        }
    },
    getSalariesByMonth: async (req, res) => {
        try {
            let offset = req.params.offset;
            offset = parseInt(offset) * 15;
            const result = await getSalariesByMonth(offset);
            return res.send({
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                success: false,
                message: "Unknown error has been occurred"
            });
        }
    },
    exportDataToExcelByMonths: async (req, res) => {
        const date = new Date();
        const filename = `${date.getTime()}-salary-by-months.xlsx`;
        let salaryData = await getSalariesForExport();
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Aylıq Maaşlar");
        worksheet.columns= [
            {header: "Adı", key: "first_name", width: 10},
            {header: "Soyadı", key: "last_name", width: 10},
            {header: "Ata adı", key: "father_name", width: 10},
            {header: "Gross", key: "gross", width: 10},
            {header: "Maaşın verilmə tarixi", key: "salary_date", width: 10},
        ]
        salaryData.forEach(salary => {
            const fPrintDataFromDB = {
                first_name: salary.first_name,
                last_name: salary.last_name,
                father_name: salary.father_name,
                gross: salary.salary_cost,
                salary_date: salary.salary_date
            };
            worksheet.addRow(fPrintDataFromDB);
        });
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = {bold: true};
        });
        const excelPath = path.join((__dirname), `../../public/excels/${filename}`);
        await workbook.xlsx.writeFile(excelPath);
        setTimeout(() => {
           fs.unlink(excelPath, (err) => {
                if(err) {
                    console.log(err);
                    res.status(400).json({
                        success: false,
                        message: "Unknown error has been occurred"
                    });
                }
           });
        }, 10000);
        res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.download(excelPath, "Aylıq Maaşlar.xlsx");
    },
    search: async (req, res) => {
        const data = req.body;
        try {
            const result = await search(data);
            return res.status(200).send({
                result: result
            });
        } catch (err) {
            console.log(err);
            return res.status(404).json({
                success: false,
                message: "An unkown error has been occurred"
            });
        }
    },
    searchSalaryByMonts: async (req, res) => {
        const data = req.body;
        try {
            const result = await searchSalaryByMonts(data);
            return res.status(200).send({
                result: result
            });
        } catch (err) {
            console.log(err);
            return res.status(404).json({
                success: false,
                message: "An unkown error has been occurred"
            });
        }
    },
    getSalaryByID: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const salary = await getSalaryByID(id);
            
            if (salary.length < 1) {
                return res.status(404).send({
                    success: false,
                    message: "This salary could not found"
                });
            }

            return res.status(200).send({
                success: true,
                salary
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    updateSalary: (req, res) => {
        try {
            const data = {};
            const id = req.params.id;
            const body = req.body;
            if (isNaN(parseInt(body.uPay)) || isNaN(parseInt(body.gross))) {
                return res.status(400).send({
                    success: false,
                    message: "Missing requirements!"
                });
            }
            data.id = id;
            data.unofficial_pay = body.uPay;
            data.gross = body.gross;
            
            updateSalary(data, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({
                        success: false,
                        message: "An unknown error has been occurred. Please contact system admin"
                    });
                }
                return res.status(201).send({
                    success: true,
                    message: "Salary has been updated"
                });
            })
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    exportDataToExcel: async (req, res) => {
        try {
            const data = req.body;
            const date = new Date();
            const filename = `${date.getTime()}-əmək-haqqı.xlsx`;
            let offset = req.body.offset;
            offset = (offset - 1) * 10;
            let salaryData = await getSalariesForExportAll(data);
            const workbook = new excelJS.Workbook();
            const worksheet = workbook.addWorksheet("Əmək-haqqı");
            worksheet.columns= [
                {header: "Əməkdaş", key: "full_name", width: 10},
                {header: "Qeyri Rəsmi Maaş", key: "unofficial_pay", width: 10},
                {header: "Gross", key: "gross", width: 10},
            ]
            salaryData.forEach(salary => {
                const salaryDataFromDB = {
                    full_name: `${salary.first_name} ${salary.last_name} ${salary.father_name}`,
                    unofficial_pay: salary.unofficial_pay,
                    gross: salary.gross,
                };
                worksheet.addRow(salaryDataFromDB);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = {bold: true};
            });
            const excelPath = path.join((__dirname), `../../public/excels/${filename}`);
            await workbook.xlsx.writeFile(excelPath);
            setTimeout(() => {
                fs.unlink(excelPath, (err) => {
                    if(err) {
                        console.log(err);
                        res.status(400).json({
                            success: false,
                            message: "Unknown error has been occurred"
                        });
                    }
                });
            }, 10000);
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.download(excelPath, "Əmək-haqqı.xlsx");
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getCalculatedSalary: async (req, res) => {
        try {
            const { id } = req.params;
            const salary = await getCalculatedSalary(id);
            if (salary.length < 1) {
                return res.status(404).send({
                    success: false,
                    message: "This salary could not found"
                });
            }

            return res.status(200).send({
                success: true,
                salary
            });

        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}