const moment = require("moment");
const { sequelize } = require("../../db_config/models");
const { QueryTypes } = require("sequelize");
const { calculateWorkDays } = require("../salary-excels/service");

async function getUser(empId) {
  const empData = await sequelize.query(
    `
    SELECT sbm.*, emp.id, emp.first_name, emp.last_name, emp.j_start_date from Employees as emp
    LEFT JOIN SalaryByMonths as sbm ON sbm.emp_id = emp.id
    WHERE emp.id = :empId
    `,
    {
      type: QueryTypes.SELECT,
      logging: false,
      replacements: {
        empId,
      },
    }
  );

  const { first_name, last_name, j_start_date, salaryPerc } = empData[0];
  const currentDate = moment().format("YYYY-MM-DD");
  const dateDiff = moment(currentDate).diff(j_start_date, "months");
  const monthCount = dateDiff >= 13 ? 13 : dateDiff;
  const last12Months =
    monthCount === 13
      ? moment(currentDate)
          .subtract(monthCount - 1, "M")
          .format("YYYY-MM-DD")
      : moment(j_start_date).format("YYYY-MM-DD");
  return {
    fullname: `${first_name} ${last_name}`,
    totalSalary: empData.slice(0, 12).reduce((acc, cur) => acc + cur.salary_cost, 0),
    workMonths: empData.length >= 12 ? 12 : empData.length,
    lastYearWorkDays: (await calculateWorkDays(last12Months, currentDate))[0].work_days,
    salaryPerc: salaryPerc || 1,
  };
}

async function vacationCalculator(empId, vacationDays) {
  const employee = await getUser(empId);
  const { fullname, workMonths, totalSalary } = employee;
  const averageSalary = Number((totalSalary / workMonths).toFixed(2));
  const dailySalary = Number((averageSalary / 30.4).toFixed(2));
  const vacationSalary = Number((dailySalary * vacationDays).toFixed(2));
  return {
    fullname,
    vacationSalary,
    totalSalary,
    averageSalary,
    dailySalary,
    vacationDays,
  };
}

async function healthVacCalcualtor(empId, vacationDays) {
  const employee = await getUser(empId);
  const { fullname, totalSalary, salaryPerc, lastYearWorkDays } = employee;
  const dailySalary = Number(((totalSalary / lastYearWorkDays) * salaryPerc).toFixed(2));
  const vacationSalary = Number((dailySalary * vacationDays).toFixed(2));
  return {
    fullname,
    vacationSalary,
    totalSalary,
    dailySalary,
    lastYearWorkDays,
    vacationDays,
  };
}

async function maternityCalculator(empId, toDate) {
  const employee = await getUser(empId);
  const { fullname, totalSalary, lastYearWorkDays } = employee;
  const currentDate = moment().format("YYYY-MM-DD");
  const workDayCount = (await calculateWorkDays(currentDate, toDate))[0].work_days;
  const dailySalary = Number((totalSalary / lastYearWorkDays).toFixed(2));
  const vacationSalary = Number((dailySalary * workDayCount).toFixed(2));
  return {
    fullname,
    vacationSalary,
    totalSalary,
    dailySalary,
    lastYearWorkDays,
    workDayCount,
    vacationDays: workDayCount,
  };
}

async function unpaidVacCalculator(empId, vacationDays) {
  const employee = await getUser(empId);
  const { fullname, totalSalary, lastYearWorkDays } = employee;
  const actualVacDays = vacationDays;
  const dailySalary = Number((totalSalary / lastYearWorkDays).toFixed(2));
  const vacationSalary = -Number((dailySalary * actualVacDays).toFixed(2));
  return {
    fullname,
    vacationSalary,
    totalSalary,
    dailySalary,
    vacationDays,
  };
}

function findVacationByKey(timeoffType) {
  switch (timeoffType) {
    case "2":
      return "vacation";
    case "3":
      return "health";
    case "5":
      return "maternity";
    case "1":
      return "unpaid";
    case "4":
      return "hourly";
    default:
      return null;
  }
}

module.exports = {
  vacationCalculator,
  healthVacCalcualtor,
  maternityCalculator,
  unpaidVacCalculator,
  findVacationByKey,
};
