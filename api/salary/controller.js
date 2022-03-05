const { getFines, getSalary, getSalaryByMonthByEmpID, getTimeOffs, getEmployeeExperience } = require("./service");
const jsDateF = new Date("01/01/2022");
const month = jsDateF.getMonth();
const year = jsDateF.getFullYear();
const date = jsDateF.getDate();
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

function timeOffCalculation(timeOffs, monthLySalaries, emp_id, gross) {
    let net = 0;
    let totalTimeOffDaysVacation = 0;
    let daysOfWork;
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
        const lastDayOfMonth = new Date(month + 1, year, 0).getDate();
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
        if(timeOff.timeoff_type === 1 && timeOff.status === 4) {
            var Difference_In_Time = timeOffEnd.getTime() - timeOffStart.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            const costForADay = parseInt(gross) / parseInt(allDaysOfWork); 
            totalTimeOffDaysVacation += (parseInt(Difference_In_Days) * costForADay);
            gross -= totalTimeOffDaysVacation;
        } else if(timeOff.timeoff_type === 2 && timeOff.status === 4) {
            let Difference_In_Time = timeOffEnd.getTime() - timeOffStart.getTime();
            let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            totalTimeOffDaysVacation += parseInt(Difference_In_Days);
            timeOffTypes.vacation = true;
        } else if(timeOff.timeoff_type === 3 && timeOff.status === 4) {
            let experience = getEmployeeExperience(emp_id);
            experience = experience[0].employee_experience_year;
            monthLySalaries.forEach(salaryByMonth => {
                totalMonthSalary += parseInt(salaryByMonth.salary_cost);
            });
            const costForADay = totalMonthSalary / monthsLength / 30.4;
            var Difference_In_Time = timeOffEnd.getTime() - timeOffStart.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            totalTimeOffDaysVacation += (parseInt(Difference_In_Days) * costForADay);
            notAtWorkCost = parseInt(Difference_In_Days) * parseInt(gross) / parseInt(allDaysOfWork);
            net = gross - notAtWorkCost;
            if (parseInt(experience) < 5) {
                notAtWorkCost = notAtWorkCost * 0.6;
            } else if (parseInt(experience) >= 5 && parseInt(experience) < 8) {
                notAtWorkCost = notAtWorkCost * 0.8;
            } else {
                notAtWorkCost;
            }
            net = gross + notAtWorkCost;
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
        net = atWorkCost + timeOffCost;
    }
    return net;
}


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
            let dsmfTax, unempTax, healthTax, fine;
            let net = gross;
            if(gross > 200) {
                if (fines[0].fine_minute > 0) {
                    fine = (gross / 1000) * parseInt(fines.fine_minute);
                } else {
                    fine = 0;
                }
                if (timeOffs.length > 0) {
                    net = timeOffCalculation(timeOffs, monthLySalaries, emp_id, gross);
                }
                dsmfTax = ((net - 200) * 10 / 100) + 6;
                unempTax = net * 0.5 / 100;
                healthTax = net * 2 / 100;
                net = net - dsmfTax - unempTax - healthTax;
                if (unofficialNet !== null || parseInt(unofficialNet) > 0) {
                    net += parseInt(unofficialNet);
                }
            } else {
                dsmfTax = gross * 3 / 100;
                unempTax = gross * 0.5 / 100;
                healthTax = gross * 2 / 100;
                net = gross - (dsmfTax + unempTax + healthTax);
            }
            console.log(net);
        });
    }
}