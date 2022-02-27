const { getAllFPrints } = require("./service");
const excelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
let errors = [];


module.exports = {
    getAllFPrints: async (req, res) => {
        errors = [];
        const data = req.body;
        try {
            const result = await getAllFPrints(data);
            res.status(200).json({
                result: result
            }); 
        } catch (err) {
            console.log(err);
            res.status(400).json({
               success: false,
               message: "An unknown error has been occurred"
            });
        }
    },
    exportDataToExcel: async (req, res) => {
        const data = req.body;
        const date = new Date();
        const filename = `${date.getTime()}-all-fprints.xlsx`;
        let fPrintData = await getAllFPrints(data);
        fPrintData = fPrintData.fprints;
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Barmaq İzləri");
        worksheet.columns= [
            {header: "Adı", key: "first_name", width: 10},
            {header: "Soyadı", key: "last_name", width: 10},
            {header: "Ata adı", key: "father_name", width: 10},
            {header: "Layihə", key: "project", width: 10},
            {header: "Departament", key: "department", width: 10},
            {header: "Vəfizə", key: "position", width: 10},
            {header: "Barmaq izi(vaxt)", key: "f_print_time", width: 10},
            {header: "Tarix", key: "f_print_date", width: 10},
        ]
        console.log(fPrintData);
        fPrintData.forEach(fPrint => {
            const fPrintDataFromDB = {
                first_name: fPrint.name,
                last_name: fPrint.surname,
                father_name: fPrint.fname,
                project: fPrint.projName,
                department: fPrint.deptName,
                position: fPrint.posName,
                f_print_time: fPrint.time,
                f_print_date: fPrint.date,
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