const { Salary, SalaryByMonth, TaxAndFine, sequelize } = require("../../db_config/models");
const { QueryTypes } = require("sequelize");
const { SalaryCalculator, getPayslipDocxBase64, createSalaryByMonths } = require("./helpers");
const moment = require("moment");
const { calculateWorkDays } = require("../salary-excels/service");
const { calcualteVacSalary } = require("../vacation/service");
const { findVacAndCalculate, findVacationByKey } = require("../vacation/helpers");
const { sendEmail } = require("../../notification/service");

module.exports = {
  getSalary: async (offset) => {
    const result = {};
    result.salaries = await sequelize.query(
      `
            SELECT sl.*, emp.working_days, emp.first_name, emp.last_name, emp.father_name FROM Salaries as sl
            LEFT JOIN Employees as emp ON sl.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            LIMIT 15 OFFSET :offset
        `,
      {
        logging: false,
        type: QueryTypes.SELECT,
        replacements: {
          offset,
        },
      }
    );

    result.count = await sequelize.query(
      `
            SELECT COUNT(*) as count FROM Salaries as sl
            LEFT JOIN Employees as emp ON sl.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `,
      {
        type: QueryTypes.SELECT,
        logging: false,
      }
    );

    return result;
  },
  getSalaryByMonthByEmpID: async (emp_id) => {
    return await sequelize.query(
      `
            SELECT sbm.* FROM SalaryByMonths as sbm
            WHERE sbm.emp_id = :emp_id
            ORDER BY salary_date DESC
            LIMIT 12 OFFSET 0
        `,
      {
        logging: false,
        type: QueryTypes.SELECT,
        replacements: {
          emp_id,
        },
      }
    );
  },
  getFines: async (emp_id) => {
    return await sequelize.query(
      `
            SELECT * FROM Fines
            WHERE emp_id = :emp_id
        `,
      {
        logging: false,
        type: QueryTypes.SELECT,
        replacements: {
          emp_id,
        },
      }
    );
  },
  getTimeOffs: async (emp_id) => {
    return await sequelize.query(
      `
                SELECT * FROM TimeOffRequests
                WHERE emp_id = :emp_id
                AND status = 4
            `,
      {
        type: QueryTypes.SELECT,
        logging: false,
        replacements: {
          emp_id,
        },
      }
    );
  },
  getFPrints: async (month, emp_id) => {
    return await sequelize.query(
      `
            SELCT * FROM FPrints 
        `,
      {
        logging: false,
        type: QueryTypes.SELECT,
      }
    );
  },
  getEmployeeExperience: async (emp_id) => {
    return await sequelize.query(
      `
            SELECT * FROM EmployeeExperiences
            WHERE emp_id = :emp_id
        `,
      {
        logging: false,
        type: QueryTypes.SELECT,
        replacements: {
          emp_id,
        },
      }
    );
  },
  getSalariesByMonth: async (offset) => {
    const result = {};
    result.salaries = await sequelize.query(
      `
            SELECT sbm.*, emp.first_name, emp.last_name, emp.father_name FROM SalaryByMonths as sbm
            LEFT JOIN Employees as emp ON emp.id = sbm.emp_id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            LIMIT 15 OFFSET :offset
        `,
      {
        logging: false,
        type: QueryTypes.SELECT,
        replacements: {
          offset,
        },
      }
    );

    result.count = await sequelize.query(
      `
            SELECT COUNT(*) as count FROM SalaryByMonths as sbm
            LEFT JOIN Employees as emp ON emp.id = sbm.emp_id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `,
      {
        logging: false,
        type: QueryTypes.SELECT,
      }
    );

    return result;
  },
  getMonthlyWorkingDays: async (limit) => {
    return await sequelize.query(
      `
            SELECT * FROM MonthlyWorkDays
            ORDER BY year DESC, month DESC
            LIMIT :limit OFFSET 0
        `,
      {
        logging: false,
        type: QueryTypes.SELECT,
        replacements: {
          limit,
        },
      }
    );
  },
  addCalculatedGrossToDB: (data, cb) => {
    SalaryByMonth.create({
      emp_id: data.emp_id,
      salary_date: data.salary_date,
      salary_cost: data.salary_cost,
    })
      .then((res) => {
        cb(null, res);
      })
      .catch((err) => {
        cb(err);
      });
  },
  search: async (data) => {
    let query = `
            SELECT slr.*, emp.first_name, emp.last_name, emp.father_name FROM Salaries as slr
            LEFT JOIN Employees as emp ON slr.emp_id = emp.id
            WHERE emp.deletedAt IS NULL 
            AND emp.j_end_date IS NULL
        `;
    let countQuery = `
            SELECT COUNT(*) as count FROM Salaries as slr
            LEFT JOIN Employees as emp ON slr.emp_id = emp.id
            WHERE emp.deletedAt IS NULL 
            AND emp.j_end_date IS NULL
        `;
    const result = {};
    let replacements = {};
    const emp = data.emp;
    const uPay = parseInt(data.uPay);
    const min = data.min;
    const max = data.max;

    if (emp !== null && emp !== "" && emp !== " ") {
      const splitEmp = emp.split(" ");
      if (splitEmp.length === 1) {
        query += `
                    AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)
                `;
        countQuery += `
                    AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)
                `;
        replacements.empName = `%${splitEmp[0]}%`;
      }
      if (splitEmp.length === 2) {
        query += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))
                `;
        countQuery += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))
                `;
        replacements.empName = `%${splitEmp[0]}%`;
        replacements.empName2 = `%${splitEmp[1]}%`;
      }
      if (splitEmp.length > 2) {
        query += `
                    AND (emp.first_name like :empName AND emp.last_name like :empName2 AND emp.father_name like :empName3)
                `;
        countQuery += `
                    AND (emp.first_name like :empName AND emp.last_name like :empName2 AND emp.father_name like :empName3)
                `;
        replacements.empName = `%${splitEmp[0]}%`;
        replacements.empName2 = `%${splitEmp[1]}%`;
        replacements.empName3 = `%${splitEmp[2]}%`;
      }
    }
    if (uPay === 1 || uPay === 2) {
      if (uPay === 1) {
        query += `
                    AND slr.unofficial_pay IS NOT NULL
                `;
        countQuery += `
                    AND slr.unofficial_pay IS NOT NULL
                `;
      }
      if (uPay === 2) {
        query += `
                    AND slr.unofficial_pay IS NULL
                `;
        countQuery += `
                    AND slr.unofficial_pay IS NULL
                `;
      }
    }
    if (min !== null && min !== "" && min !== " ") {
      query += `
                AND slr.gross >= :min
            `;
      countQuery += `
                AND slr.gross >= :min
            `;
      replacements.min = min;
    }
    if (max !== null && max !== "" && max !== " ") {
      query += `
                AND slr.gross <= :max
            `;
      countQuery += `
                AND slr.gross <= :max
            `;
      replacements.max = max;
    }
    query += `
            LIMIT 15 OFFSET :offset
        `;
    replacements.offset = parseInt(data.offset) * 15;
    result.salaries = await sequelize.query(query, {
      logging: false,
      type: QueryTypes.SELECT,
      replacements,
    });
    result.count = await sequelize.query(countQuery, {
      logging: false,
      type: QueryTypes.SELECT,
      replacements,
    });
    return result;
  },
  searchSalaryByMonts: async (data) => {
    let query = `
            SELECT sbm.*, emp.first_name, emp.last_name, emp.father_name FROM SalaryByMonths as sbm
            LEFT JOIN Employees as emp ON sbm.emp_id = emp.id
            WHERE emp.deletedAt IS NULL 
            AND emp.j_end_date IS NULL
        `;
    let countQuery = `
            SELECT COUNT(*) as count FROM SalaryByMonths as sbm
            LEFT JOIN Employees as emp ON sbm.emp_id = emp.id
            WHERE emp.deletedAt IS NULL 
            AND emp.j_end_date IS NULL
        `;
    const result = {};
    let replacements = {};
    const emp = data.emp;
    let month = null;
    let year = null;
    const min = data.min;
    const max = data.max;

    if (data.qSalaryDate !== null && data.qSalaryDate !== "") {
      let splittedSalaryDate = data.qSalaryDate.split(".");
      month = splittedSalaryDate[0];
      year = splittedSalaryDate[1];
    }

    if (emp !== null && emp !== "" && emp !== " ") {
      const splitEmp = emp.split(" ");
      if (splitEmp.length === 1) {
        query += `
                    AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)
                `;
        countQuery += `
                    AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)
                `;
        replacements.empName = `%${splitEmp[0]}%`;
      }
      if (splitEmp.length === 2) {
        query += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))
                `;
        countQuery += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))
                `;
        replacements.empName = `%${splitEmp[0]}%`;
        replacements.empName2 = `%${splitEmp[1]}%`;
      }
      if (splitEmp.length > 2) {
        query += `
                    AND (emp.first_name like :empName AND emp.last_name like :empName2 AND emp.father_name like :empName3)
                `;
        countQuery += `
                    AND (emp.first_name like :empName AND emp.last_name like :empName2 AND emp.father_name like :empName3)
                `;
        replacements.empName = `%${splitEmp[0]}%`;
        replacements.empName2 = `%${splitEmp[1]}%`;
        replacements.empName3 = `%${splitEmp[2]}%`;
      }
    }
    if (month !== null && month !== "" && month !== " " && month !== "Ay") {
      query += `
                AND MONTH(sbm.salary_date) = :month
            `;
      countQuery += `
                AND MONTH(sbm.salary_date) = :month
            `;
      replacements.month = month;
    }
    if (year !== null && year !== "" && year !== " " && year !== "İl") {
      query += `
                AND YEAR(sbm.salary_date) = :year
            `;
      countQuery += `
                AND YEAR(sbm.salary_date) = :year
            `;
      replacements.year = year;
    }
    if (min !== null && min !== "" && min !== " ") {
      query += `
                AND sbm.salary_cost >= :min
            `;
      countQuery += `
                AND sbm.salary_cost >= :min
            `;
      replacements.min = min;
    }
    if (max !== null && max !== "" && max !== " ") {
      query += `
                AND sbm.salary_cost <= :max
            `;
      countQuery += `
                AND sbm.salary_cost <= :max
            `;
      replacements.max = max;
    }

    query += `
            LIMIT 15 OFFSET :offset
        `;
    replacements.offset = parseInt(data.offset) * 15;

    result.salaries = await sequelize.query(query, {
      logging: false,
      type: QueryTypes.SELECT,
      replacements,
    });
    result.count = await sequelize.query(countQuery, {
      logging: false,
      type: QueryTypes.SELECT,
      replacements,
    });
    return result;
  },
  getSalariesForExport: async () => {
    return await sequelize.query(
      `
            SELECT sbm.*, emp.first_name, emp.last_name, emp.father_name FROM SalaryByMonths as sbm
            LEFT JOIN Employees as emp ON emp.id = sbm.emp_id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `,
      {
        logging: false,
        type: QueryTypes.SELECT,
      }
    );
  },
  getSalaryByID: async (id) => {
    return await sequelize.query(
      `
            SELECT * FROM Salaries
            WHERE id = :id
        `,
      {
        logging: false,
        type: QueryTypes.SELECT,
        replacements: {
          id,
        },
      }
    );
  },
  updateSalary: (data, cb) => {
    Salary.update(
      {
        gross: data.gross,
        unofficial_pay: data.unofficial_pay,
      },
      {
        where: {
          id: data.id,
        },
        logging: false,
      }
    )
      .then((res) => {
        cb(null, res);
      })
      .catch((err) => {
        cb(err);
      });
  },
  getSalariesForExportAll: async (data) => {
    let query = `
            SELECT slr.*, emp.first_name, emp.last_name, emp.father_name FROM Salaries as slr
            LEFT JOIN Employees as emp ON slr.emp_id = emp.id
            WHERE emp.deletedAt IS NULL 
            AND emp.j_end_date IS NULL
        `;
    let replacements = {};
    const emp = data.emp;
    const uPay = parseInt(data.uPay);
    const min = data.min;
    const max = data.max;

    if (emp !== null && emp !== "" && emp !== " ") {
      const splitEmp = emp.split(" ");
      if (splitEmp.length === 1) {
        query += `
                    AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)
                `;
        replacements.empName = `%${splitEmp[0]}%`;
      }
      if (splitEmp.length === 2) {
        query += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))
                `;
        replacements.empName = `%${splitEmp[0]}%`;
        replacements.empName2 = `%${splitEmp[1]}%`;
      }
      if (splitEmp.length > 2) {
        query += `
                    AND (emp.first_name like :empName AND emp.last_name like :empName2 AND emp.father_name like :empName3)
                `;
        replacements.empName = `%${splitEmp[0]}%`;
        replacements.empName2 = `%${splitEmp[1]}%`;
        replacements.empName3 = `%${splitEmp[2]}%`;
      }
    }
    if (uPay === 1 || uPay === 2) {
      if (uPay === 1) {
        query += `
                    AND slr.unofficial_pay IS NOT NULL
                `;
      }
      if (uPay === 2) {
        query += `
                    AND slr.unofficial_pay IS NULL
                `;
      }
    }
    if (min !== null && min !== "" && min !== " ") {
      query += `
                AND slr.gross >= :min
            `;
      replacements.min = min;
    }
    if (max !== null && max !== "" && max !== " ") {
      query += `
                AND slr.gross <= :max
            `;
      replacements.max = max;
    }

    return await sequelize.query(query, {
      logging: false,
      type: QueryTypes.SELECT,
      replacements,
    });
  },
  getCalculatedSalary: async (id = null) => {
    let replacements = {};
    const startDate = moment().subtract(1, "M").startOf("month").format("YYYY-MM-DD");
    const endDate = moment().subtract(1, "M").endOf("month").format("YYYY-MM-DD");

    let joins =
      ` LEFT JOIN Departments ON Departments.id = Employees.department` +
      ` LEFT JOIN Positions ON Positions.id = Employees.position_id` +
      ` LEFT JOIN Users ON Users.emp_id = Employees.id`;
    let empQuery =
      `SELECT CONCAT(Employees.first_name," ", Employees.father_name, " ", Employees.last_name) AS fullname,` +
      `Employees.id,j_start_date,working_days, Employees.FIN as fin, Salaries.gross, Departments.name as department, Positions.name as position, Users.email as email FROM Employees`;
    if (id) {
      empQuery =
        empQuery.replace("FROM Employees", "FROM Salaries") +
        " LEFT JOIN Employees ON Employees.id = Salaries.emp_id" +
        joins +
        " WHERE Salaries.emp_id = :id";
      replacements.id = id;
    } else {
      empQuery += ` LEFT JOIN Salaries ON Salaries.emp_id = Employees.id` + joins;
    }

    let isNotNullQuery = "Employees.j_end_date IS NULL";
    if (empQuery.includes("WHERE")) empQuery += ` AND ${isNotNullQuery}`;
    else empQuery += ` WHERE ${isNotNullQuery}`;

    const employees = await sequelize.query(empQuery, {
      logging: false,
      type: QueryTypes.SELECT,
      replacements,
    });
    if (!employees.length) return { error: "No employees found" };

    const empIds = new Set(employees.map((emp) => emp.id));
    let torQuery = `SELECT emp_id,timeoff_type,timeoff_start_date,timeoff_job_start_date FROM TimeOffRequests WHERE TimeOffRequests.emp_id IN (${Array.from(
      empIds
    ).join()}) AND TimeOffRequests.status = 4 AND TimeOffRequests.timeoff_start_date BETWEEN :startDate AND :endDate`;
    const timeOffs = await sequelize.query(torQuery, {
      logging: false,
      type: QueryTypes.SELECT,
      replacements: {
        id,
        startDate,
        endDate,
      },
    });

    const parsedEmps = employees.map((emp) => ({ ...emp, timeOffs: timeOffs.filter((tor) => tor.emp_id === emp.id) }));
    return await Promise.all(
      parsedEmps.map(async (emp) => {
        let vacationSalary = {};
        let currentMonthTimeOffSalary = 0;
        if (emp.timeOffs.length) {
          var workDaysInVacDays = 0;
          for (let tor of emp.timeOffs) {
            const toDate = moment(tor.timeoff_job_start_date).isBefore(endDate) ? tor.timeoff_job_start_date : endDate;
            const vacationDays = (await calculateWorkDays(tor.timeoff_start_date, toDate))[0].work_days;
            const vacType = findVacationByKey(tor.timeoff_type.toString());
            const vacSalary = await calcualteVacSalary({
              empId: tor.emp_id,
              vacationType: vacType,
              vacationDays,
              toDate,
            });
            vacationSalary[vacType] = vacSalary.vacationSalary;
            currentMonthTimeOffSalary += vacSalary.vacationSalary;
            if (vacType === "unpaid") emp.gross += vacSalary.vacationSalary;
            workDaysInVacDays += vacationDays;
          }
        }
        // done todo iş günləri
        // done todo calc. vac salary
        // todo emp's work days calc.
        // todo Məzuniyyətin faktiki qalıq günləri
        const empWithTaxes = new SalaryCalculator(emp);
        const workDaysCount = (await calculateWorkDays(startDate, endDate))[0].work_days;
        const calculatedSalary = empWithTaxes.getCalculatedData();
        const currentMonthGross = calculatedSalary.gross;
        const dailySalaryTimeOff = Object.keys(vacationSalary).length !== 0 ? vacationSalary : 0;
        const totalCostGross = calculatedSalary.gross;
        const overLimitPhoneBill = 0;
        const gymBill = 0,
          aliment = 0,
          creditOrMortgage = 0,
          lateFine = 0,
          otherFines = 0;
        const totalTaxAndFine = calculatedSalary.empTotalTax + aliment + gymBill + lateFine;
        const totalCompanyTaxes = calculatedSalary.totalTax;
        const lastCost = calculatedSalary.nett;

        return {
          id: emp.id,
          email: emp.email,
          timeOffDaysCount: workDaysInVacDays ?? 0,
          startDate,
          endDate,
          workDaysCount,
          dailySalary: Number((calculatedSalary.nett / 30).toFixed(2)),
          currentMonthGross,
          dailySalaryTimeOff,
          currentMonthTimeOffSalary,
          totalCostGross,
          overLimitPhoneBill,
          gymBill,
          aliment,
          creditOrMortgage,
          lateFine,
          otherFines,
          totalTaxAndFine,
          totalCompanyTaxes,
          lastCost,
          ...calculatedSalary,
        };
      })
    );
  },
  createSalaryRecordAndSendEmail: async () => {
    let userDatas = await module.exports.getCalculatedSalary();
    userDatas = userDatas.filter((e) => e.gross > 0); // ! remove this line
    if (userDatas.length) {
      let isSent = false; // ! delete this line
      const createSalaryByMonthsBulk = createSalaryByMonths(userDatas);
      await TaxAndFine.bulkCreate(createSalaryByMonthsBulk);
      userDatas.forEach(async (userData) => {
        if (!isSent && userData.email === "emil.taciyev@gmail.com") {
          isSent = true; // ! delete this line

          const email = userData.email;
          const fullname = userData.nameSurnameFather;
          const salary = userData.lastCost;
          const { startDate, endDate } = userData;
          const subject = "Maaş hesabatı - Payslip";
          const html =
            `<div> Salam, <h3> ${fullname}, </h3>` +
            `<p> <span style="font-weight:bold">${startDate}</span> tarixindən başlayaraq ` +
            `<span style="font-weight:bold">${endDate}</span> tarixinə qədər olan maaş hesabatınız hazırdır.</p>` +
            `<p> Maaşınız <span style="font-weight:bold">${salary}</span> təşkil edir </p> </div> `;

          const attachmentsBase64 = await getPayslipDocxBase64(userData);
          const attachments = [
            {
              filename: `${fullname}-payslip.docx`,
              path:
                "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," +
                attachmentsBase64,
            },
          ];
          sendEmail(email, subject, html, attachments);
        }
      });
    }
  },
};
