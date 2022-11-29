const { getNoFPrints, update } = require("./service");
const excelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

module.exports = {
    getNoFPrints: async (req, res) => {
        try {
            const data = req.body;
            const result = await getNoFPrints(data);
            console.log(result);
            res.status(200).send({
                count: result.count[0].count,
                fprints: result.nfprints
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    exportDataToExcel: async (req, res) => {
        const data = req.body;
        const date = new Date();
        const filename = `${date.getTime()}-all-fprints.xlsx`;
        let nfPrintData = await getNoFPrints(data);
        nfPrintData = nfPrintData.nfprints;
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Barmaq İzləri");
        worksheet.columns= [
            {header: "Adı", key: "first_name", width: 10},
            {header: "Soyadı", key: "last_name", width: 10},
            {header: "Ata adı", key: "father_name", width: 10},
            {header: "Layihə", key: "project", width: 10},
            {header: "Departament", key: "department", width: 10},
            {header: "Vəfizə", key: "position", width: 10},
            {header: "Giriş", key: "enter", width: 10},
            {header: "Çıxış", key: "leave", width: 10},
            {header: "Tarix", key: "f_print_date", width: 10},
        ]
        nfPrintData.forEach(nfPrint => {
            const fPrintDataFromDB = {
                first_name: nfPrint.name,
                last_name: nfPrint.surname,
                father_name: nfPrint.fname,
                project: nfPrint.projName,
                department: nfPrint.deptName,
                position: nfPrint.posName,
                enter: nfPrint.enter_sign_time,
                leave: nfPrint.leave_sign_time,
                f_print_date: nfPrint.createdAt
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
        res.download(excelPath, "Barmaq İzləri(All).xlsx");
    },
    update: async (req, res) => {
        try {
            const { leave_sign_time, f_print_id } = req.query;
            if (!leave_sign_time || leave_sign_time === "") {
                return res.status(400).send({
                    success: false,
                    message: "Please provide leave time"
                });
            }
            const user_id = req.user.id;
            const result = await update(user_id, leave_sign_time, f_print_id);

            if (!result) {
                return res.status(400).send({
                    success: false,
                    message: "This record not found please try again"
                });
            }

            return res.status(200).send({
                success: true,
                message: "Updated!"
            });
        } catch (err) {
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}