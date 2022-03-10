const { addEmpFineDataIfNotExists, addFine, getFprints, getFineData, getEmployeeID, addCalculatedFine} = require("./service");
const date = new Date();
const month = date.getMonth();
const year = date.getFullYear();

module.exports = {
    calculateFine: async (req, res, next) => {
        const lastDateOfMonth = new Date(2021, 9, 0).getDate();
        let nonExistingEmpData = {};
        let existingEmpData = {};
        let calculatedFine = {};
        let penalty_calc = 0;
        let array = [];
        let empIDs = await getEmployeeID();
        for (let i = 1; i <= lastDateOfMonth; i++) {
            for (let s = 0; s < empIDs.length; s++) {
                let fPrintData = await getFprints(i, empIDs[s].id);
                let fineData = await getFineData(empIDs[s].id);
                if(fPrintData.length > 1) {
                    const emp_id = fPrintData[0].emp_id;
                    let fPrintTime = fPrintData[0].f_print_time.split(":");
                    let fPrintLeaveTime = fPrintData[fPrintData.length - 1].f_print_time.split(":");
                    let shiftStartTime = fPrintData[0].shift_start_t.split(":");
                    let shiftEndTime = fPrintData[0].shift_end_t.split(":");
                    const fPrintEnterTimeInHourToMinute = ((parseInt(fPrintTime[0]) - parseInt(shiftStartTime[0])) * 60);
                    const fPrintEnterTimeInMinute = (parseInt(fPrintTime[1]) - parseInt(shiftStartTime[1]));
                    const fPrintLeaveTimeInHourToMinute = ((parseInt(shiftEndTime[0]) - parseInt(fPrintLeaveTime[0])) * 60);
                    const fPrintLeaveTimeInMinute = (parseInt(shiftEndTime[1]) - parseInt(fPrintLeaveTime[1]));
                    const fPrintEnterTotalMinutes = fPrintEnterTimeInHourToMinute + fPrintEnterTimeInMinute;
                    const fPrintLeaveTotalMinutes = fPrintLeaveTimeInHourToMinute + fPrintLeaveTimeInMinute;
                    let penaltyHourToMinute = fPrintEnterTimeInHourToMinute + fPrintLeaveTimeInHourToMinute;
                    let penaltyMinute = fPrintEnterTimeInMinute + fPrintLeaveTimeInMinute;
                    penalty_calc = penaltyHourToMinute + penaltyMinute;
                    if(penalty_calc > 0) {
                        if(fineData.length < 1) {
                            nonExistingEmpData.emp_id = emp_id;
                            nonExistingEmpData.minute_total = penalty_calc;
                            nonExistingEmpData.fine_minute = 0;
                            nonExistingEmpData.fine_status = 0;

                            if (fPrintEnterTotalMinutes < 1 || fPrintLeaveTotalMinutes < 1) {
                                calculatedFine.emp_id = emp_id;
                                if (fPrintEnterTotalMinutes > 0) {
                                    calculatedFine.f_print_time = fPrintData[0].f_print_time;
                                    calculatedFine.f_print_date = fPrintData[0].f_print_date;
                                    calculatedFine.calculatedMinute = fPrintEnterTotalMinutes;
                                } else if(fPrintLeaveTotalMinutes > 0) {
                                    calculatedFine.f_print_time = fPrintData[fPrintData.length - 1].f_print_time;
                                    calculatedFine.f_print_date = fPrintData[fPrintData.length - 1].f_print_date;
                                    calculatedFine.calculatedMinute = fPrintLeaveTotalMinutes;
                                }
                                addCalculatedFine(calculatedFine, (err, result) => {
                                    if(err) {
                                        console.log(err);
                                        req.flash("error_msg", "An unknown error has been occurred");
                                        return res.redirect("/fines");
                                    }
                                });
                                if (fPrintEnterTotalMinutes < 0 || fPrintLeaveTotalMinutes < 0) {
                                    if (fPrintEnterTotalMinutes < 0) {
                                        calculatedFine.f_print_time = fPrintData[0].f_print_time;
                                        calculatedFine.f_print_date = fPrintData[0].f_print_date;
                                        calculatedFine.calculatedMinute = fPrintEnterTotalMinutes;
                                    } else if(fPrintLeaveTotalMinutes < 0) {
                                        calculatedFine.f_print_time = fPrintData[fPrintData.length - 1].f_print_time;
                                        calculatedFine.f_print_date = fPrintData[fPrintData.length - 1].f_print_date;
                                        calculatedFine.calculatedMinute = fPrintLeaveTotalMinutes;
                                    }
                                    addCalculatedFine(calculatedFine, (err, result) => {
                                        if(err) {
                                            console.log(err);
                                            req.flash("error_msg", "An unknown error has been occurred");
                                            return res.redirect("/fines");
                                        }
                                    });
                                }
                            } else if (fPrintEnterTotalMinutes > 0 && fPrintLeaveTotalMinutes > 0) {
                                calculatedFine.emp_id = emp_id;
                                calculatedFine.f_print_time = fPrintData[0].f_print_time;
                                calculatedFine.f_print_date = fPrintData[0].f_print_date;
                                calculatedFine.calculatedMinute = fPrintEnterTotalMinutes;
                                addCalculatedFine(calculatedFine, (err, result) => {
                                    if(err) {
                                        console.log(err);
                                        req.flash("error_msg", "An unknown error has been occurred");
                                        return res.redirect("/fines");
                                    }
                                });
                                calculatedFine.f_print_time = fPrintData[fPrintData.length - 1].f_print_time;
                                calculatedFine.f_print_date = fPrintData[fPrintData.length - 1].f_print_date;
                                calculatedFine.calculatedMinute = fPrintLeaveTotalMinutes;
                                addCalculatedFine(calculatedFine, (err, result) => {
                                    if(err) {
                                        console.log(err);
                                        req.flash("error_msg", "An unknown error has been occurred");
                                        return res.redirect("/fines");
                                    }
                                });
                            } else {
                                req.flash("error_msg", "There is an unkown error while adding calculated fprints");
                                return res.redirect("/fines");
                            }
                            
                            addEmpFineDataIfNotExists(nonExistingEmpData, (err, result) => {
                                if(err) {
                                    console.log("AddEmpFineDataIfNotExists Error");
                                    console.log(err);
                                    req.flash("error_msg", "An unknown error has been occurred please contact system admin");
                                    return res.redirect("/fines");
                                }
                                if (emp_id === 180) {
                                    console.log("2 defe ishleyir")
                                }
                            });
                        } else if(fineData.length === 1) {
                            let minuteTotal;
                            if (fineData[0].minute_total === null || parseInt(fineData[0].minute_total) === 0) {
                                minuteTotal = 0;
                            } else {
                                minuteTotal = parseInt(fineData[0].minute_total);
                            }
                            if (fPrintEnterTotalMinutes < 1 || fPrintLeaveTotalMinutes < 1) {
                                calculatedFine.emp_id = emp_id;
                                if (fPrintEnterTotalMinutes > 0) {
                                    calculatedFine.f_print_time = fPrintData[0].f_print_time;
                                    calculatedFine.f_print_date = fPrintData[0].f_print_date;
                                    calculatedFine.calculatedMinute = fPrintEnterTotalMinutes;
                                } else if(fPrintLeaveTotalMinutes > 0) {
                                    calculatedFine.f_print_time = fPrintData[fPrintData.length - 1].f_print_time;
                                    calculatedFine.f_print_date = fPrintData[fPrintData.length - 1].f_print_date;
                                    calculatedFine.calculatedMinute = fPrintLeaveTotalMinutes;
                                }
                                addCalculatedFine(calculatedFine, (err, result) => {
                                    if(err) {
                                        console.log(err);
                                        req.flash("error_msg", "An unknown error has been occurred");
                                        return res.redirect("/fines");
                                    }
                                });
                                if (fPrintEnterTotalMinutes < 0 || fPrintLeaveTotalMinutes < 0) {
                                    if (fPrintEnterTotalMinutes < 0) {
                                        calculatedFine.f_print_time = fPrintData[0].f_print_time;
                                        calculatedFine.f_print_date = fPrintData[0].f_print_date;
                                        calculatedFine.calculatedMinute = fPrintEnterTotalMinutes;
                                    } else if(fPrintLeaveTotalMinutes < 0) {
                                        calculatedFine.f_print_time = fPrintData[fPrintData.length - 1].f_print_time;
                                        calculatedFine.f_print_date = fPrintData[fPrintData.length - 1].f_print_date;
                                        calculatedFine.calculatedMinute = fPrintLeaveTotalMinutes;
                                    }
                                    addCalculatedFine(calculatedFine, (err, result) => {
                                        if(err) {
                                            console.log(err);
                                            req.flash("error_msg", "An unknown error has been occurred");
                                            return res.redirect("/fines");
                                        }
                                    });
                                }
                            } else if (fPrintEnterTotalMinutes > 0 && fPrintLeaveTotalMinutes > 0) {
                                calculatedFine.emp_id = emp_id;
                                calculatedFine.f_print_time = fPrintData[0].f_print_time;
                                calculatedFine.f_print_date = fPrintData[0].f_print_date;
                                calculatedFine.calculatedMinute = fPrintEnterTotalMinutes;
                                addCalculatedFine(calculatedFine, (err, result) => {
                                    if(err) {
                                        console.log(err);
                                        req.flash("error_msg", "An unknown error has been occurred");
                                        return res.redirect("/fines");
                                    }
                                });
                                calculatedFine.f_print_time = fPrintData[fPrintData.length - 1].f_print_time;
                                calculatedFine.f_print_date = fPrintData[fPrintData.length - 1].f_print_date;
                                calculatedFine.calculatedMinute = fPrintLeaveTotalMinutes;
                                addCalculatedFine(calculatedFine, (err, result) => {
                                    if(err) {
                                        console.log(err);
                                        req.flash("error_msg", "An unknown error has been occurred");
                                        return res.redirect("/fines");
                                    }
                                });
                            } else {
                                req.flash("error_msg", "There is an unkown error while adding calculated fprints");
                                return res.redirect("/fines");
                            } 
                            let totalLate = minuteTotal + penalty_calc;
                            existingEmpData.emp_id = emp_id;
                            existingEmpData.minute_total = totalLate;
                            addFine(existingEmpData, (err, result) => {
                                if(err) {
                                    console.log("Add Fine Error")
                                    console.log(err);
                                    req.flash("error_msg", "An unknown error has been occurred please contact system admin");
                                    return res.redirect("/fines");
                                }
                            });
                        }
                    }
                }
            }
        }
        req.flash("success_msg", "Cərimələr hesablandı")
        return res.redirect("/fines");
    },
    renderFinePage: async (req, res) => {
        if(req.user.role === 1) {
            res.render("fine/fine", {
                super_admin: true
            });
        } else if (req.user.role === 5) {
            res.render("fine/fine", {
                hr: true
            });
        }else if (req.user.role === 2) {
            res.render("fine/fine", {
                hr: true
            });
        }
    },
    renderCumilativeFPrints: async (req, res) => {
        if(req.user.role === 1) {
            return res.render('fine/cumilative-fprints', {
                super_admin: true
            });
        } else if (req.user.role === 5) {
            return res.render('fine/cumilative-fprints', {
                hr: true
            });
        }
    }
}