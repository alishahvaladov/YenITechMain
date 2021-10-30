const { getFPrints, findEmpFromLogix, addLogixDataToDB, addUnknownEmpsToDB } = require("./service");
const readXlsxFile = require("read-excel-file/node");
const path = require("path");
let errors = [];

module.exports = {
    getFPrints: async (req, res) => {
        errors = [];
        const result = await getFPrints();
        for (let i = 0; i < result.length; i++) {
            let cTime = result[i].createdAt;
            cTime = new Date(cTime).toLocaleDateString();
            result[i].createdA1t = cTime;
        }
        try {
            if(req.user.role === 1) {
                res.render("fprint/fprints", {
                    super_admin: true,
                    result
                });
            } else if (req.user.role === 5) {
                res.render("fprint/fprints", {
                    hr: true,
                    result
                });
            }
        } catch (err) {
            errors.push({msg: "No Record For Today"});
            if(req.user.role === 1) {
                res.render("fprint/fprints", {
                    super_admin: true,
                    errors
                });
            } else if (req.user.role === 5) {
                res.render("fprint/fprints", {
                    hr: true,
                    errors
                });
            }
        }
    },
    addFPrintToDB: async (req, res) => {
        try {
            let user_id = req.user.id;
            const file = req.file.path;
            readXlsxFile(file).then(async (rows) => {
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
                        let dateTime = currentRow[1];
                        const unixTime = (dateTime - 25569) * 86400 * 1000;
                        dateTime = new Date(unixTime).toLocaleDateString().split("/");
                        dateTime = `${dateTime[2].toString()}-${dateTime[0].toString()}-${dateTime[1].toString()}`;
                        data.user_id = user_id;
                        data.emp_id = result[0].emp_id;
                        data.f_print_time = currentRow[7];
                        data.createdAt = dateTime;
                        data.updatedAt = dateTime;
                        if(currentRow[4] !== null || currentRow[4] !== '' || currentRow[4] !== ' ') {
                            data.tabel_no = currentRow[4];
                        }
                        // console.log(dateTime);
                        addLogixDataToDB(data, (err, res) => {
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
                        addUnknownEmpsToDB(data, (err, res) => {
                           if (err) {
                               console.log(err);
                               req.flash("An unknown error has been occurred please contact System Admin");
                               return res.redirect("/fprints");
                           }
                        });
                    }
                }
            });
            req.flash("success_msg", "Finger print information have been uploaded successfully");
            return res.redirect("/fprints");
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
            res.redirect("/fprints");
        }
    }
}