const { 
    getEmpInfo, 
    getTimeOffs, 
    addTimeOff,
    getDirectors,
    getEmployeeData,
    checkIfEmpExists, 
    checkIfEmpFileExists, 
    addFileNames, 
    updateFileNames, 
    getTimeOffApproveForHR, 
    cancelRequestByHr,
    approveRequestByHr,
    getTimeOffApproveForDR,
    cancelRequestByDR,
    approveRequestByDR,
    getEmployeeByUserID,
    getTimeOffByID, 
    approveTimeOffRequest,
    getDirectorDepartment,
    getTimeOffsForDirector,
    getTimeOffsForExport
} = require("./service");
const path = require("path");
const fs = require("fs");
const excelJS = require("exceljs");
const dayOffsJson = require("../../config/config.json").day_offs;


module.exports = { 
    getEmpInfo: async (req, res) => {
        const id = req.body.id;
        const result = await getEmpInfo(id);

        res.send({
            result
        })
    },
    getTimeOffs: async (req, res) => {
        try {
            let result;
            let directorProject;
            let hr_approve = false;
            let director_approve = false;
            let id = req.user.id;
            let offset = req.query.offset;
            offset = parseInt(offset) * 15;
            const body = req.body;
            if (req.user.role === 10) {
                directorProject = await getEmployeeByUserID(id);
                directorProject = directorProject[0].project_id;
            }
            if (req.query.hr_approve === "true") {
                hr_approve = true;
                result = await getTimeOffs(hr_approve, director_approve, null, offset, body);
            } else if (req.query.director_approve === "true") {
                director_approve = true;
                result = await getTimeOffs(hr_approve, director_approve, directorProject, offset, body);
            } else {
                result = await getTimeOffs(hr_approve, director_approve, null, offset, body);
            }
            res.status(200).send({
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getTimeOffByID: async (req, res) => {
        const id = req.params.id;
        const result = await getTimeOffByID(id);
        res.send({
            result
        });
    },
    addTimeOff: async (req, res) => {
        try {
            const body = req.body;
            body.user_id = req.user.id;
            if (parseInt(body.timeOffType) === 4) {
                if(body.emp === "" || parseInt(body.emp) === 0 || body.toffTime === "" || body.toffTimeDate === "" || body.timeOffType === "") {
                    return res.status(400).send({
                        success: false,
                        message: "Missing requirements"
                    });
                }
                body.timeOffStartDate = null;
                body.timeOffEndDate = null;
                body.wStartDate = null;
            } else {
                if(body.emp === "" || parseInt(body.emp) === 0 || body.timeOffStartDate === "" || body.timeOffEndDate === "" || body.timeOffType === "" || body.wStartDate === "") {
                    return res.status(400).send({
                        success: false,
                        message: "Missing requirements"
                    });
                }
                const timeOffStartDate = new Date(body.timeOffStartDate);
                const timeOffEndDate = new Date(body.timeOffEndDate);

                if (timeOffStartDate.getTime() > timeOffEndDate.getTime()) {
                    return res.status(400).send({
                        success: false,
                        message: "Please choose valid time off dates"
                    });
                }
                body.toffTime = null;
                body.toffTimeDate = null;
            }

            addTimeOff(body, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(520).send({
                        success: false,
                        message: "An unknown error has been occurred"
                    });
                }
                return res.status(200).send({
                    success: true
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            })
        }
    },
    getDirectors: async (req, res) => {
        const body = req.body;
        const result = await getDirectors(body);
        return res.status(200).send({
            result
        })
    },
    checkUploadPath: async (req, res, next) => {
        let empPath = "";
        const id = parseInt(req.params.id);
        try {
            const result = await getEmployeeData(id);
            empPath = path.join(__dirname, "../../public/employees/time-off/form/" + result[0].id.toString() + "-" + result[0].first_name.toLocaleLowerCase() + "-" + result[0].last_name.toLocaleLowerCase() + "-" + result[0].father_name.toLocaleLowerCase());
        } catch (err) {
            console.log(err);
            return res.status(404).send({
                success: false,
                message: "This employee couldn't find please try again or contact System Admin"
            });
        }
        fs.access(empPath, fs.constants.F_OK, err => {
           if (err) {
               fs.mkdir(empPath, { recursive: true }, (err) => {
                  if (err) {
                      console.log(err);
                      return res.status(400).send({
                          success: false,
                          message: "An unknown error has been occurred please contact System Admin"
                      });
                  } 
               });
           }
           next();
        });
    },
    uploadFilePathToDB: async (req, res, next) => {
        let emp_id;
        if(req.params.id) {
            emp_id = parseInt(req.params.id);
        } else {
            return res.status(400).send({
                success: false,
                message: "Please select employee"
            });
        }
        if(req.fileValidationError) {
            return res.status(400).send({
                success: false,
                message: "Please choose correct file format"
            })
        }
        if(req.fileUploadError) {
            return res.status(400).send({
                success: false,
                message: "An unknown error has been occurred"
            })
        }
        let data = {};

        checkIfEmpExists(emp_id, (err, empRes) => {
            if(err) {
                console.log(err);
                return res.status(400).send({
                    success: false,
                    message: "An unknown error has been occurred"
                })
            }
            if(empRes === null) {
                return res.status(400).send({
                    success: false,
                    message: "This employee does not exists"
                })
            }
            checkIfEmpFileExists(emp_id, (err, empFileRes) => {
                if(err) {
                    console.log(err);
                    return res.status(400).send({
                        success: false,
                        message: "An unknown error has been occurred"
                    });
                } 
                if(empFileRes === null) {
                    let files = {};
                    files.dayoffform = JSON.stringify(req.file);
                    data.files = JSON.stringify(files);
                    data.user_id = req.user.id;
                    data.emp_id = emp_id;
                    addFileNames(data, (err, result) => {
                        if(err) {
                            console.log(err);
                            return res.status(400).send({
                                success: false,
                                message: "An unknown error has been occurred"
                            })
                        }
                        return res.send({
                            result
                        })
                    });
                } else {
                    const empData = JSON.parse(empFileRes.dataValues.uploaded_files);
                    empData.dayoffform = JSON.stringify(req.file);
                    data.user_id = req.user.id;
                    data.emp_id = emp_id;
                    data.files = JSON.stringify(empData);
                    updateFileNames(data, (err, result) => {
                        if(err) {
                            return res.status(400).send({
                                success: false,
                                message: "An unknown error has been occurred"
                            });
                        }
                        return res.send({
                            result
                        });
                    });
                }
            });
        });
    },
    getTimeOffApproveForHR: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await getTimeOffApproveForHR(id);
            const uploaded_files = JSON.parse(result[0].uploaded_files);
            console.log(uploaded_files);
            const dayOffForm = JSON.parse(uploaded_files.dayoffform);
            const fileName = dayOffForm.filename;
            result[0].uploaded_files = null
            return res.status(200).send({
                result,
                fileName
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getTimeOffApproveForDR: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await getTimeOffApproveForDR(id);
            const uploaded_files = JSON.parse(result[0].uploaded_files);
            const dayOffForm = JSON.parse(uploaded_files.dayoffform);
            const fileName = dayOffForm.filename;
            result[0].uploaded_files = null
            return res.status(200).send({
                result,
                fileName
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    cancelRequestByHr: (req, res) => {
        try {
            let id = req.params.id;
            cancelRequestByHr(id, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send({
                        success: false,
                        message: "An unknown error has been occurred"
                    });
                }
                res.send({
                    message: "Canceled"
                })
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    cancelRequestByDR: (req, res) => {
        try {
            let id = req.params.id;
            cancelRequestByDR(id, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send({
                        success: false,
                        message: "An unknown error has been occurred"
                    });
                }
                res.send({
                    message: "Canceled"
                })
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    approveRequestByHr: (req, res) => {
        try {
            let id = req.params.id;
            approveRequestByHr(id, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send({
                        success: false,
                        message: "An unknown error has been occurred"
                    });
                }
                res.send({
                    message: "Approved"
                })
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    approveRequestByDR: (req, res) => {
        try {
            let id = req.params.id;
            approveRequestByDR(id, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send({
                        success: false,
                        message: "An unknown error has been occurred"
                    });
                }
                res.send({
                    message: "Approved"
                })
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    checkLetterUploadPath: async (req, res, next) => {
        try {
            let empPath = "";
            const id = parseInt(req.params.id);
            try {
                const result = await getEmployeeData(id);
                empPath = path.join(__dirname, "../../public/employees/time-off/letter/" + result[0].id.toString() + "-" + result[0].first_name.toLocaleLowerCase() + "-" + result[0].last_name.toLocaleLowerCase() + "-" + result[0].father_name.toLocaleLowerCase());
            } catch (err) {
                console.log(err);
                return res.status(404).send({
                    success: false,
                    message: "This employee couldn't find please try again or contact System Admin"
                });
            }
            await fs.access(empPath, fs.constants.F_OK, err => {
            if (err) {
                fs.mkdir(empPath, { recursive: true }, (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).send({
                            success: false,
                            message: "An unknown error has been occurred please contact System Admin"
                        });
                    }
                });
            }
            next();
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    uploadLetterFilePathToDB: async (req, res, next) => {
        try {
            let emp_id;
            const id = parseInt(req.body.id);
            if(req.params.id) {
                emp_id = parseInt(req.params.id);
            } else {
                return res.status(400).send({
                    success: false,
                    message: "Please select employee"
                });
            }
            if(req.fileValidationError) {
                return res.status(400).send({
                    success: false,
                    message: "Please choose correct file format"
                })
            }
            if(req.fileUploadError) {
                return res.status(400).send({
                    success: false,
                    message: "An unknown error has been occurred"
                })
            }
            let data = {};

            checkIfEmpExists(emp_id, (err, empRes) => {
                if(err) {
                    console.log(err);
                    return res.status(400).send({
                        success: false,
                        message: "An unknown error has been occurred"
                    })
                }
                if(empRes === null) {
                    return res.status(400).send({
                        success: false,
                        message: "This employee does not exists"
                    })
                }
                checkIfEmpFileExists(emp_id, (err, empFileRes) => {
                    if(err) {
                        console.log(err);
                        return res.status(400).send({
                            success: false,
                            message: "An unknown error has been occurred"
                        });
                    }
                    if(empFileRes === null) {
                        let files = {};
                        files.letter = JSON.stringify(req.file);
                        data.files = JSON.stringify(files);
                        data.user_id = req.user.id;
                        data.emp_id = emp_id;
                        addFileNames(data, (err, result) => {
                            if(err) {
                                console.log(err);
                                return res.status(400).send({
                                    success: false,
                                    message: "An unknown error has been occurred"
                                });
                            }
                            approveTimeOffRequest(id, (err, result) => {
                                if(err) {
                                    console.log(err);
                                    return res.status(400).send({
                                        success: false,
                                        message: "An unknown error has been occurred"
                                    });
                                }
                            });
                            return res.send({
                                result
                            })
                        });
                    } else {
                        const empData = JSON.parse(empFileRes.dataValues.uploaded_files);
                        empData.letter = JSON.stringify(req.file);
                        data.user_id = req.user.id;
                        data.emp_id = emp_id;
                        data.files = JSON.stringify(empData);
                        updateFileNames(data, (err, result) => {
                            if(err) {
                                return res.status(400).send({
                                    success: false,
                                    message: "An unknown error has been occurred"
                                });
                            }
                            approveTimeOffRequest(id, (err, result) => {
                                if(err) {
                                    console.log(err);
                                    return res.status(400).send({
                                        success: false,
                                        message: "An unknown error has been occurred"
                                    });
                                }
                            });
                            return res.send({
                                result
                            });
                        });
                    }
                });
            });
        } catch (err) {
            console.log(rrr);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    requestTimeOffAsUser: (req, res) => {
        try {
            const body = req.body;
            body.user_id = req.user.id;
            if (parseInt(body.timeOffType) === 4) {
                if(body.emp === "" || parseInt(body.emp) === 0 || body.toffTime === "" || body.toffTimeDate === "" || body.timeOffType === "") {
                    return res.status(400).send({
                        success: false,
                        message: "Missing requirements"
                    });
                }
                body.timeOffStartDate = null;
                body.timeOffEndDate = null;
                body.wStartDate = null;
            } else {
                if(body.emp === "" || parseInt(body.emp) === 0 || body.timeOffStartDate === "" || body.timeOffEndDate === "" || body.timeOffType === "" || body.wStartDate === "") {
                    return res.status(400).send({
                        success: false,
                        message: "Missing requirements"
                    });
                }
                body.toffTime = null;
                body.toffTimeDate = null;
            }

            addTimeOff(body, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(520).send({
                        success: false,
                        message: "An unknown error has been occurred"
                    });
                }
                return res.status(200).send({
                    success: true
                });
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups.. Something went wrong!"
            });
        }
    },
    getTimeOffsForDirector: async (req, res) => {
        try {
            const user_id = req.user.id;
            const department = await getDirectorDepartment(user_id);
            const offset = parseInt(req.query.offset) * 15;
            let dr_approve = false;
            if (req.query.director_approve === "true") {
                dr_approve = true;
            }
            const result = await getTimeOffsForDirector(department[0].department, dr_approve, offset);

            return res.status(200).send({
                success: true,
                result
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    exportDataToExcel: async (req, res) => {
        try {
            const data = req.body;
            const date = new Date();
            const filename = `${date.getTime()}-məzuniyyətlər.xlsx`;
            let offset = req.body.offset;
            offset = (offset - 1) * 10;
            let timeOffData = await getTimeOffsForExport(data);
            const workbook = new excelJS.Workbook();
            const worksheet = workbook.addWorksheet("Məzuniyyətlər");
            worksheet.columns= [
                {header: "Əməkdaş", key: "full_name", width: 10},
                {header: "Məzuniyyətin Tipi", key: "timeoff_type", width: 10},
                {header: "Başlama Tarixi", key: "timeoff_start_date", width: 10},
                {header: "Bitmə Tarixi", key: "timeoff_end_date", width: 10},
                {header: "İşə Qayıtma Tarixi", key: "timeoff_job_start_date", width: 10},
                {header: "Status", key: "status", width: 10},
            ]
            timeOffData.forEach(timeOff => {
                let dayOffName = dayOffsJson[timeOff.timeoff_type];
                let statusName;
                if(timeOff.status === 0) {
                    statusName = `Sənəd Əksikdir`;
                } else if (timeOff.status === 1){
                    statusName = `Emaldadır(HR)`;
                } else if (timeOff.status === 2) {
                    statusName = `Emaldadır(Şöbə Rəhbəri)`;
                } else if (timeOff.status === 3) {
                    statusName = `Əmr təsdiqi gözləyir`;
                } else if (timeOff.status === 4) {
                    statusName = `Təsdiqləndi`;
                } else if (timeOff.status === 7) {
                    statusName = `Ləğv Edildi`;
                }
                const userDataFromDB = {
                    full_name: `${timeOff.first_name} ${timeOff.last_name} ${timeOff.father_name}`,
                    timeoff_type: dayOffName,
                    timeoff_start_date: timeOff.timeoff_start_date,
                    timeoff_end_date: timeOff.timeoff_end_date,
                    timeoff_job_start_date: timeOff.timeoff_job_start_date,
                    status: statusName
                };
                worksheet.addRow(userDataFromDB);
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
            res.download(excelPath, "Məzuniyyətlər.xlsx");
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}