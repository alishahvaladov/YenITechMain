const { getEmpInfo, 
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
    getTimeOffByID } = require("./service");
const path = require("path");
const fs = require("fs");

module.exports = { 
    getEmpInfo: async (req, res) => {
        const id = req.body.id;
        const result = await getEmpInfo(id);

        res.send({
            result
        })
    },
    getTimeOffs: async (req, res) => {
        let timeOffs;
        let directorProject;
        let hr_approve = false;
        let director_approve = false;
        let id = req.user.id;
        if (req.user.role === 10) {
            directorProject = await getEmployeeByUserID(id);
            directorProject = directorProject[0].project_id;
        }
        if (req.query.hr_approve === "true") {
            hr_approve = true;
            timeOffs = await getTimeOffs(hr_approve, director_approve);
        } else if (req.query.director_approve === "true") {
            director_approve = true;
            timeOffs = await getTimeOffs(hr_approve, director_approve, directorProject);
        } else {
            timeOffs = await getTimeOffs(hr_approve, director_approve);
        }
        res.status(200).send({
            timeOffs
        });
    },
    getTimeOffByID: async (req, res) => {
        const id = req.params.id;
        const result = await getTimeOffByID(id);
        res.send({
            result
        });
    },
    addTimeOff: async (req, res) => {
        const body = req.body;
        const socket = req.user.socket;
        if(body.emp === "" || parseInt(body.emp) === 0 || body.timeOffStartDate === "" || body.timeOffEndDate === "" || body.timeOffType === "" || body.wStartDate === "") {
            return res.status(400).send({
                success: false,
                message: "Missing requirements"
            });
        }
        const empInfo = await getEmpInfo(body.emp);
        addTimeOff(body, async (err, result) => {
            if(err) {
                console.log(err);
                return res.status(520).send({
                    success: false,
                    message: "An unknown error has been occurred"
                });
            }
            let data = {
                employee: `${empInfo[0].first_name} ${empInfo[0].last_name} ${empInfo[0].father_name}`,
                project: empInfo[0].project_id,
                department: empInfo[0].department,
                position: empInfo[0].position_id
            }
            socket.emit("time-off-notification", data);
            socket.on("new-time-off-notification", (data) => {
                console.log(data);
            });
            console.log("Time Off Request Added");
            return res.status(200).send({
                success: true
            });
        });



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
            res.status(400).send({
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
                            req.flash("error_msg", "An unknown error has been occurred");
                            return res.status(400).send({
                                success: false,
                                message: "An unknown error has been occurred"
                            })
                        }
                        res.send({
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
                            })
                        }
                        res.send({
                            result
                        });
                    });
                }
            });
        });
    }, 
    getTimeOffApproveForHR: async (req, res) => {
        const id = req.params.id;
        const result = await getTimeOffApproveForHR(id);
        const uploaded_files = JSON.parse(result[0].uploaded_files);
        const dayOffForm = JSON.parse(uploaded_files.dayoffform);
        const fileName = dayOffForm.filename;
        result[0].uploaded_files = null
        return res.status(200).send({
            result,
            fileName
        });
    },
    getTimeOffApproveForDR: async (req, res) => {
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
    },
    cancelRequestByHr: (req, res) => {
        let id = req.params.id;
        console.log(id)
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
        })
    },
    cancelRequestByDR: (req, res) => {
        let id = req.params.id;
        console.log(id)
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
        })
    },
    approveRequestByHr: (req, res) => {
        let id = req.params.id;
        console.log(id)
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
        })
    },
    approveRequestByDR: (req, res) => {
        let id = req.params.id;
        console.log(id)
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
        })
    },
}