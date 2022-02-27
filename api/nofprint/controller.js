const { getNoFPrints } = require("./service");
const excelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

module.exports = {
    getNoFPrints: async (req, res) => {
        try {
            const data = req.body;
            let result = await getNoFPrints(data);
 
            res.send({
                result
            });
        } catch (e) {
            req.flash("error_msg", "An unkown error has been occurred");
            return res.redirect("/fprints");
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
        console.log(nfPrintData);
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
        console.log(excelPath);
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
    }
}