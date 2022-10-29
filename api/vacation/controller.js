const { calcualteVacSalary } = require("./service");

module.exports = {
  calcualteVacSalary: async function (req, res) {
    try {
      return res.status(200).send(await calcualteVacSalary(req.query));
    } catch (err) {
      console.log(err);
      return res.status(400).send({
        success: false,
        message: "An unknown error has been occurred",
      });
    }
  },
};
