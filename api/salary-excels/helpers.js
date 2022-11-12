const moment = require("moment");

function setColumnDateHeaders() {
  const currentDate = moment().startOf("month");
  const monthsKey = [0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11];
  return monthsKey.map((month) => {
    const oldMonth = moment(currentDate).add(month, "M").format("DD/MM/YYYY");
    return { header: oldMonth, key: month, width: 15 };
  });
}

function iteratorForEmptyMonths(monthCount) {
  const months = {};
  for (monthCount; -12 !== monthCount; monthCount--) {
    months[monthCount] = "empty";
  }
  return months;
}

module.exports = {
  setColumnDateHeaders,
  iteratorForEmptyMonths,
};
