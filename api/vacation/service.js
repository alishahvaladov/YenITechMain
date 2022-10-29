const { vacationCalculator, healthVacCalcualtor, maternityCalculator, unpaidVacCalculator } = require("./helpers");

module.exports = {
  calcualteVacSalary: async function (input) {
    const { vacationType, empId, vacationDays, toDate } = input;
    switch (vacationType) {
      case "vacation":
        return await vacationCalculator(empId, vacationDays);
      case "health":
        return await healthVacCalcualtor(empId, vacationDays);
      case "maternity":
        return await maternityCalculator(empId, toDate);
      case "unpaid":
        return await unpaidVacCalculator(empId, vacationDays);
    }
  },
};
