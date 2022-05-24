const fileName = '../../config/config.json';
const path = require('path');
const standardShiftTypes = require(fileName).shift_types[1];
const standardShiftTypesForUpdate = require(fileName);
const fs = require('fs');


module.exports = {
    getStandardShiftTypes: (req, res) => {
        try {
            return res.status(200).send({
                success: true,
                types: standardShiftTypes.types
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
                    standardShiftTypesForUpdate.shift_types[1].types[0].shift_start = shift.shift_start;
                    standardShiftTypesForUpdate.shift_types[1].types[0].shift_end = shift.shift_end;
                }
                if (shift.name === "Yarımştat(Günün birinci yarısı)") {
                    standardShiftTypesForUpdate.shift_types[1].types[1].shift_start = shift.shift_start;
                    standardShiftTypesForUpdate.shift_types[1].types[1].shift_end = shift.shift_end;
                }
                if (shift.name === "Yarımştat(Günün ikinci yarısı)") {
                    standardShiftTypesForUpdate.shift_types[1].types[2].shift_start = shift.shift_start;
                    standardShiftTypesForUpdate.shift_types[1].types[2].shift_end = shift.shift_end;
                }
            });
            fs.writeFile(path.join(__dirname, fileName), JSON.stringify(standardShiftTypesForUpdate), (err) => {
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
    }
}