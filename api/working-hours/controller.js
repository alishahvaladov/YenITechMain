const fileName = '../../config/config.json';
const path = require('path');
const standardShiftTypes = require(fileName).shift_types[1];
const config = require(fileName);
const workDateWeekly = require(fileName).work_date_in_week;
const fs = require('fs');


module.exports = {
    getStandardShiftTypes: (req, res) => {
        try {
            return res.status(200).send({
                success: true,
                types: standardShiftTypes.types,
                workDateWeekly
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    },
    updateStandardShiftTypes: (req, res) => {
        try {
            const shiftTypes = req.body.shiftTypes;
            shiftTypes.forEach(shift => {
                if (shift.name === "Tam ştat") {
                    config.shift_types[1].types[0].shift_start = shift.shift_start;
                    config.shift_types[1].types[0].shift_end = shift.shift_end;
                }
                if (shift.name === "Yarımştat(Günün birinci yarısı)") {
                    config.shift_types[1].types[1].shift_start = shift.shift_start;
                    config.shift_types[1].types[1].shift_end = shift.shift_end;
                }
                if (shift.name === "Yarımştat(Günün ikinci yarısı)") {
                    config.shift_types[1].types[2].shift_start = shift.shift_start;
                    config.shift_types[1].types[2].shift_end = shift.shift_end;
                }
            });
            fs.writeFile(path.join(__dirname, fileName), JSON.stringify(config), (err) => {
                if (err){
                    console.log(err);
                    return res.status(400).send({
                        success: false,
                        message: "An unkown error has been occurred"
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: "Working hours updated successfully"
                });
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    updateWorkDatesWeekly: (req, res) => {
        try {
            const workDate = req.body.workDate;
            if (workDate === "5 Gün") {
                config.work_date_in_week["5 Gün"] = true;
                config.work_date_in_week["6 Gün"] = false;
            } else {
                config.work_date_in_week["5 Gün"] = false;
                config.work_date_in_week["6 Gün"] = true;
            }
            fs.writeFile(path.join(__dirname, fileName), JSON.stringify(config), (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({
                        success: false,
                        message: "An unknown error has been occurred"
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: "Work date has been updated"
                });
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}