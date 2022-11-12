const { Workbook } = require("exceljs");
const { SalaryByMonth, sequelize } = require("../../db_config/models");
const { getEmployees } = require("../../modules/employee/employee.service");
const { QueryTypes } = require("sequelize");
const { setColumnDateHeaders, iteratorForEmptyMonths } = require("./helpers");
const moment = require("moment");

module.exports = {
  createExcelTemplate: async function () {
    const workbookForWrite = new Workbook();
    const workSheet = workbookForWrite.addWorksheet("import-salary");

    workSheet.columns = [
      { header: "emp_id", key: "emp_id", width: 10 },
      { header: "employee", key: "fullname", width: 30 },
      ...setColumnDateHeaders(),
    ];

    const employees = await getEmployees();
    employees.forEach((emp) => {
      const dateDiff = moment(emp.j_start_date).diff(moment(), "months");
      const { id, first_name, last_name, father_name } = emp;
      const row = workSheet.addRow({
        emp_id: id,
        fullname: `${first_name} ${last_name} ${father_name}`,
        ...(dateDiff > -12 && iteratorForEmptyMonths(dateDiff)),
      });
      row.eachCell((cell) => {
        if (cell.value === "empty") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFC7CE" },
          };
        }
      });
    });
    return await workbookForWrite.xlsx.writeBuffer();
  },
  readImportedExcel: async function (excelBase64) {
    const ignoredIdxs = [0, 1, 2];
    const importedWorkbook = new Workbook();
    const splittedBase64 = excelBase64.split(",")[1];
    const importedExcel = await importedWorkbook.xlsx.load(Buffer.from(splittedBase64, "base64"));
    const worksheet = importedExcel.getWorksheet("import-salary");

    const salariesToSave = [];
    const getDates = worksheet.getRow(1).values;
    const wsLength = worksheet.rowCount;
    for (let i = 2; i <= wsLength; i++) {
      worksheet.getRow(i).values.forEach(function (salary, index) {
        if (!ignoredIdxs.includes(index) && salary !== "empty") {
          salariesToSave.push({
            emp_id: worksheet.getColumn(1).values[i],
            salary_cost: salary,
            salary_date: getDates[index],
          });
        }
      });
    }
    return await SalaryByMonth.bulkCreate(salariesToSave);
  },
  calculateWorkDays: async function (startDate, endDate) {
    return await sequelize.query(
      `
      SELECT COUNT(*) AS work_days FROM WorkCalendars
      WHERE date BETWEEN :startDate AND :endDate AND status = 1
      `,
      {
        type: QueryTypes.SELECT,
        logging: false,
        replacements: {
          startDate,
          endDate,
        },
      }
    );
  },
};
