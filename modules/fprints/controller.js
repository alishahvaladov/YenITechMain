const { getFPrints,
    findEmpFromLogix,
    addLogixDataToDB,
    addUnknownEmpsToDB,
    getFPrintsByDate,
    addForgottenFPrintsToDB,
    getEmployeesIDsAndShiftTimes
} = require("./service");
const readXlsxFile = require("read-excel-file/node");
const path = require("path");
const date = new Date();
const month = date.getMonth();
const year = date.getFullYear();
const dateOfDay = date.getDate();
let lastDayOfMonth;
let lastFPrintDate;
if(dateOfDay === 1) {
    lastDayOfMonth = new Date(year, month , 0);
} else {
    lastDayOfMonth = dateOfDay - 1;
}

module.exports = {
    getFPrints: async (req, res) => {
        if(req.user.role === 1) {
            res.render("fprint/fprints", {
                super_admin: true
            });
        } else if (req.user.role === 5) {
            res.render("fprint/fprints", {
                hr: true
            });
        }
    },
    checkIfFPrintForgotten: async (req, res, next) => {
        const empIDsAndShiftTimes = await getEmployeesIDsAndShiftTimes();
        let fPrintData = {};
        for (let i = 1; i <= lastDayOfMonth; i++) {
            for (let j = 0; j < empIDsAndShiftTimes.length; j++) {
                let fPrintDataHasValue = false;
                fPrintData = {};
                const result = await getFPrintsByDate(empIDsAndShiftTimes[j].id, i);
                const splitShiftStart = parseInt(empIDsAndShiftTimes[j].shift_start_t.split(":")[0]);
                const splitShiftEnd = parseInt(empIDsAndShiftTimes[j].shift_end_t.split(":")[0]);
                console.log(result.length);
                if (result.length === 1) {
                    const splittedTime = result[0].f_print_time.split(":");
                    if(parseInt(splittedTime[0]) >= splitShiftEnd - 2) {
                        fPrintData.emp_id = empIDsAndShiftTimes[j].id;
                        fPrintData.f_print_date = result[0].f_print_date;
                        fPrintData.f_print_time_entrance = null;
                        fPrintData.f_print_time_exit = result[0].f_print_time;
                        fPrintDataHasValue = true;
                    } else {
                        fPrintData.emp_id = empIDsAndShiftTimes[j].id;
                        fPrintData.f_print_date = result[0].f_print_date;
                        fPrintData.f_print_time_entrance = result[0].f_print_time;
                        fPrintData.f_print_time_exit = null;
                        fPrintDataHasValue = true;
                    }
                    if(fPrintDataHasValue) {
                        addForgottenFPrintsToDB(fPrintData, (err, result) => {
                            if(err) {
                                console.log(err);
                                req.flash("error_msg", "An unknown error has been occurred");
                                return res.redirect("/fines");
                            }
                        });
                    }
                } else if (result.length > 1) {
                    let countEntrance = 0;
                    let countExit = 0;
                    let timeEntrance;
                    let timeExit;
                    let dateEntrance;
                    let dateExit;
                    for (let k = 0; k < result.length; k++) {
                        const splittedTime = result[k].f_print_time.split(":");
                        if(parseInt(splittedTime[0]) >= splitShiftEnd - 2) {
                            timeExit = result[k].f_print_time;
                            dateExit = result[k].f_print_date;
                            console.log("timeExit: " + timeExit);
                            console.log(splittedTime);
                            countExit++;
                        }
                        if(parseInt(splittedTime[0]) <= splitShiftStart + 2) {
                            timeEntrance = result[k].f_print_time;
                            dateEntrance = result[k].f_print_date;
                            countEntrance++;
                        }
                    }
                    if(countEntrance < 1) {
                        fPrintData.emp_id = empIDsAndShiftTimes[j].id;
                        fPrintData.f_print_time_exit = timeExit;
                        fPrintData.f_print_time_entrance = null;
                        fPrintData.f_print_date = dateExit;
                        fPrintDataHasValue = true;
                    } else if (countExit < 1) {
                        fPrintData.emp_id = empIDsAndShiftTimes[j].id;
                        fPrintData.f_print_time_entrance = timeEntrance;
                        fPrintData.f_print_date = dateEntrance;
                        fPrintData.f_print_time_exit = null;
                        console.log(fPrintData);
                        fPrintDataHasValue = true;
                    }
                    if(fPrintDataHasValue) {
                        addForgottenFPrintsToDB(fPrintData, (err, result) => {
                            if(err) {
                                console.log(err);
                                req.flash("error_msg", "An unknown error has been occurred.");
                                return res.redirect("/fprints");
                            }
                        });
                    }
                }
            }
        }
        req.flash("success_msg", "Finger print information have been uploaded successfully. Please check for forgotten finger prints");
        return res.redirect("/fprints");
    },
    addFPrintToDB: async (req, res, next) => {
        try {
            let user_id = req.user.id;
            const file = req.file.path;
            let importExcelValidation = true;
            readXlsxFile(file).then(async (rows) => {
                if(
                    rows[0][0] !== "#" || rows[0][1] !== "Tarix" || rows[0][2] !== "Əməkdaş" || rows[0][3] !== "Vəzifə"
                    || rows[0][4] !== "Tabel No" || rows[0][5] !== "Departament" || rows[0][6] !== "Kart No"
                    || rows[0][7] !== "Saat" || rows[0][9] !== "Şöbə" || rows[0][10] !== "Door") {
                    importExcelValidation = false;
                } else {
                    for (let i = 1; i < rows.length; i++) {
                        let currentRow = rows[i];
                        let data = {};
                        let empName = rows[i][2];
                        let tabelNo;
                        if(currentRow[4] !== null || currentRow[4] !== '' || currentRow[4] !== ' ') {
                            tabelNo = currentRow[4];
                        } else {
                            tabelNo = null;
                        }
                        const result = await findEmpFromLogix(empName, tabelNo);
                        if (result.length > 0) {
                            data.user_id = user_id;
                            data.emp_id = result[0].emp_id;
                            data.f_print_date = readXlsxFile.parseExcelDate(currentRow[1]).toLocaleDateString();
                            data.f_print_time = currentRow[7];
                            if(currentRow[4] !== null || currentRow[4] !== '' || currentRow[4] !== ' ') {
                                data.tabel_no = currentRow[4];
                            }
                            addLogixDataToDB(data, (err, result) => {
                                if (err) {
                                    console.log("There is an error uploading the excel row");
                                    console.log(err);
                                }
                                // console.log(res);
                            });
                        } else {
                            data.name = currentRow[2];
                            data.f_print_time = currentRow[7];
                            data.tabel_no = currentRow[4];
                            addUnknownEmpsToDB(data, (err, result) => {
                                if (err) {
                                    console.log(err);
                                    req.flash("An unknown error has been occurred please contact System Admin");
                                    return res.redirect("/all-fprints");
                                }
                            });
                        }
                    }
                }
                if(importExcelValidation) {
                    setTimeout(next, 1000);
                } else {
                    req.flash("error_msg", "Xahiş olunur düzgün excel faylını(Logix proqramından export olunmuş) yükləyin.");
                    return await res.redirect("/all-fprints");
                }
            });
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
            res.redirect("/all-fprints");
        }
    },
    renderForgottenFPrints: (req, res) => {
        if(req.user.role === 1) {
            res.render("fprint/forgotten-fprint", {
                super_admin: true
            });
        } else if (req.user.role === 5) {
            res.render("fprint/forgotten-fprint", {
                hr: true
            });
        }
    }
}