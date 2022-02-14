const { addEmpFineDataIfNotExists, addFine, getFprints, getFineData, getEmployeeID} = require("./service");
const date = new Date();
const month = date.getMonth();
const year = date.getFullYear();

module.exports = {
    calculateFine: async (req, res, next) => {
        const lastDateOfMonth = new Date(2021, 9, 0).getDate();
        let nonExistingEmpData = {};
        let existingEmpData = {};
        let penalty_calc = 0;
        let array = [];
        let empIDs = await getEmployeeID();
        for (let i = 1; i <= lastDateOfMonth; i++) {
            for (let s = 0; s < empIDs.length; s++) {
                let fPrintData = await getFprints(i, empIDs[s].id);
                if(fPrintData.length > 1) {
                    const emp_id = fPrintData[0].emp_id;
                    let fPrintTime = fPrintData[0].f_print_time.split(":");
                    let shiftStartTime = fPrintData[0].shift_start_t.split(":");
                    let fineData = await getFineData(emp_id);
                    let penaltyHourToMinute = (parseInt(fPrintTime[0]) - parseInt(shiftStartTime[0])) * 60;
                    let penaltyMinute = parseInt(fPrintTime[1]) - parseInt(shiftStartTime[1]);
                    penalty_calc = penaltyHourToMinute + penaltyMinute;
                    if(penalty_calc > 0) {
                        console.log(fPrintData[0]);
                        if(fineData.length < 1) {
                            nonExistingEmpData.emp_id = emp_id;
                            nonExistingEmpData.minute_total = penalty_calc;
                            nonExistingEmpData.fine_minute = 0;
                            nonExistingEmpData.fine_status = 0;
                            addEmpFineDataIfNotExists(nonExistingEmpData, (err, result) => {
                                if(err) {
                                    console.log("AddEmpFineDataIfNotExists Error");
                                    console.log(err);
                                    req.flash("error_msg", "An unknown error has been occurred please contact system admin");
                                    return res.redirect("/fines");
                                }
                            });
                        } else { 
                            let totalLate = parseInt(fineData.minute_total) + penalty_calc;
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
        res.send({
            success: true
        });
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
        }
    }
}