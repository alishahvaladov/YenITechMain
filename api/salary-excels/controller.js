const stream = require("stream");
const { createExcelTemplate, readImportedExcel, calculateWorkDays } = require("./service");

module.exports = {
  getExcelTemplate: async (req, res) => {
    try {
      const excelBuffer = await createExcelTemplate();

      const excelBase64 = Buffer.from(excelBuffer, "base64");
      const readStream = new stream.PassThrough();
      readStream.end(excelBase64);

      res.set("Content-disposition", "attachment; filename=" + "salary-excel.xlsx");
      res.set("Content-Type", "text/plain");
      return readStream.pipe(res);
    } catch (err) {
      console.log(err);
      return res.status(400).send({
        success: false,
        message: "An unknown error has been occurred",
      });
    }
  },
  readImportedExcel: async (req, res) => {
    try {
      const { excel: excelBase64 } = req.body;
      return res.status(201).send(await readImportedExcel(excelBase64));
    } catch (err) {
      console.log(err);
      return res.status(400).send({
        success: false,
        message: "An unknown error has been occurred",
      });
    }
  },
  calculateWorkDays: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const workDaysCount = await calculateWorkDays(startDate, endDate);
      return res.status(200).send(workDaysCount);
    } catch (err) {
      console.log(err);
      return res.status(400).send({
        success: false,
        message: "An unknown error has been occurred",
      });
    }
  },
};
