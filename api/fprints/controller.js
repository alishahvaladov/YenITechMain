const { searchFPrint, renderForgottenFPrints, updateForgottenFPrints, getForgottenFPrintById, createFPrintForForgottenFPrint, getFPrintsForDeptDirectors, getActiveFPrints } = require("./service");
const excelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

module.exports = {
    searchFPrint: async (req, res) => {
        try {
            const data = req.body;
            let result = await searchFPrint(data);

            res.status(200).send({
                result
            });
        } catch (e) {
            req.flash("error_msg", "An unkown error has been occurred");
            return res.redirect("/fprints");
        }
    },
    renderFPrints: async (req, res) => {
        try {
            const data = req.body;
            let fPrints = await searchFPrint(req.body);
            res.send({
                fPrints
            })
        } catch (err) {
            console.log(err);
            res.send({
                err: "An unknown error has been occurred",
                status: res.status
            });
        }
    },
    getFPrintsByPage: async (req, res) => {
        const data = req.body;
        try {
            let fPrints = await searchFPrint(data);
            res.send({
                fPrints
            });

        } catch (err) {
            console.log(err);
            res.send({
                err: "An unknown error has been occurred",
                status: res.status
            });
        }
    },
    renderForgottenFPrints: async (req, res) => {
        try {
            let offset = req.params.offset;
            offset = parseInt(offset) * 15;
            const result = await renderForgottenFPrints(offset);
            return res.status(200).send({
                success: true,
                result: result.forgottenData,
                count: result.countData
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                error: true,
                message: "An unknown error has been occurred"
            });
        }
    },
    updateForgottenFPrints: async (req, res) => {
        const query = req.query;
        const id = query.btnValue;
        const data = {};
        const fPrintData = {};
        const time = query.time;
        const entrance = (query.entrance === 'true');
        const exit = (query.exit === 'true');
        const forgottenData = await getForgottenFPrintById(id);
        if(forgottenData[0].f_print_time_entrance !== null && forgottenData[0].f_print_time_exit !== null) {
            return res.status(403).json({
                success: false,
                message: "This user's entrance and exit already exist"
            });
        }

        if(entrance === true) {
            fPrintData.emp_id = forgottenData[0].emp_id;
            fPrintData.user_id = req.user.id;
            fPrintData.f_print_date = forgottenData[0].f_print_date;
            fPrintData.f_print_time = time;
            createFPrintForForgottenFPrint(fPrintData, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: "Unknown error has been occurred"
                    })
                }
            });
            data.id = id;
            data.f_print_time_entrance = time;
            data.f_print_time_exit = forgottenData[0].f_print_time_exit;
            updateForgottenFPrints(data, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: "Unknown error has been occurred"
                    });
                }
            });
        } else if (exit === true) {
            fPrintData.emp_id = forgottenData[0].emp_id;
            fPrintData.user_id = req.user.id;
            fPrintData.f_print_date = forgottenData[0].f_print_date;
            fPrintData.f_print_time = time;
            data.id = id;
            data.f_print_time_entrance = forgottenData[0].f_print_time_entrance;
            data.f_print_time_exit = time;
            createFPrintForForgottenFPrint(fPrintData, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: "Unknown error has been occurred"
                    })
                }
            });
            updateForgottenFPrints(data, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: "Unknown error has been occurred"
                    });
                }
            });
        }

    },
    exportDataToExcel: async (req, res) => {
        const data = req.body;
        const date = new Date();
        const filename = `${date.getTime()}-all-fprints.xlsx`;
        let fPrintData = await searchFPrint(data);
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
        fPrintData.forEach(fPrint => {
            const fPrintDataFromDB = {
                first_name: fPrint.name,
                last_name: fPrint.surname,
                father_name: fPrint.fname,
                project: fPrint.projName,
                department: fPrint.deptName,
                position: fPrint.posName,
                f_print_time: fPrint.f_print_time,
                f_print_date: fPrint.f_print_date,
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
    getFPrintsForDeptDirectors: async (req, res) => {
        try {
            const body = req.body;
            body.user_id = req.user.id;
            const limit = parseInt(body.limit);
            const offset = parseInt(body.offset);

            body.limit = limit;
            body.offset = offset * limit;

            const result = await getFPrintsForDeptDirectors(body);

            return res.status(200).send({
                success: true,
                fprints: result.fprints,
                count: result.count
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getActiveFPrints: async ( req, res) => {
        try {
            const body = req.body;
            const result = await getActiveFPrints(body);
            return res.status(200).send({
                fPrints: result.fPrints,
                count: result.count[0].count
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    }
}