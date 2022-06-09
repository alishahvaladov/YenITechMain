const config = require('../../config/config.json');
const {
    renderProfile,
    getProfilePicture,
    getUserDataAsEmployee,
    addTimeOff,
    getUsername,
    getSalaryByMonthsForUser,
    getUserTimeOffs,
    getUserPassword,
    changePassword,
    getAllSalariesForUser
} = require("./service");
const bcrypt = require("bcryptjs");
const excelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

module.exports = {
    renderProfile: async (req, res) => {
        try {
            const id = req.user.id;
            const profileData = await renderProfile(id);
            return res.status(200).json({
                profile: profileData
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                success: false,
                message: "Something went wrong"
            });
        }
    },
    getProfilePicture: async (req, res) => {
        const id = req.user.id;
        try {
            const username = await getUsername(id);
            const result = await getProfilePicture(id);
            let uploadedFiles = result[0].uploaded_files;
            uploadedFiles = JSON.parse(uploadedFiles);
            uploadedFiles = JSON.parse(uploadedFiles.recruitment);
            const filename = `/employee/files/recruitment/${result[0].id}-${result[0].first_name.toLowerCase()}-${result[0].last_name.toLowerCase()}-${result[0].father_name.toLowerCase()}/${uploadedFiles.profilePicture[0].filename}`;
            return res.status(200).send({
                filename,
                username
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "An unkown error has been occurred"
            });
        }
    },
    getUserDataAsEmployee: async (req, res) => {
        try {
            const user_id = req.user.id;
            const employee = await getUserDataAsEmployee(user_id);
            
            return res.status(200).send({
                success: true,
                employee
            });
        } catch(err) {
            console.log(err);
            return res.status(404).send({
                success: false,
                message: "This employee couldn't find please contact system admin!"
            });
        }
    },
    addTimeOff: async (req, res) => {
        try {
            const timeOffTypes = config.day_offs;
            const body = req.body;
            let timeOffTypeValidation = false;
            if (parseInt(body.timeOffType) === 4) {
                body.timeOffStartDate = null;
                body.timeOffEndDate = null
                body.wStartDate = null

                if (body.toffTime === "" || !body.toffTime) {
                    return res.status(400).send({
                        success: false,
                        message: "Please fill time off time field"
                    });
                }

                if (body.toffTimeDate === "" || !body.toffTimeDate) {
                    return res.status(400).send({
                        success: false,
                        message: "Please fill date for time off time field"
                    });
                }
            } else {
                if (body.timeOffType === "" || !body.timeOffType) {
                    return res.status(400).send({
                        success: false,
                        message: "Please choose timeOffType"
                    });
                } else {
                    body.toffTime = null;
                    body.toffTimeDate = null;
                    for (const [key, value] of Object.entries(timeOffTypes)) {
                        if(parseInt(body.timeOffType) === parseInt(key)) {
                            timeOffTypeValidation = true;
                            break;
                        }
                    }
                }

                if (!timeOffTypeValidation) {
                    return res.status(400).send({
                        success: false,
                        message: "Please choose correct time off type"
                    });
                }
    
                if (body.timeOffStartDate === "" || !body.timeOffStartDate) {
                    return res.status(400).send({
                        success: false,
                        message: "Please choose time off start date"
                    });
                }
                if (body.timeOffEndDate === "" || !body.timeOffEndDate) {
                    return res.status(400).send({
                        success: false,
                        message: "Please choose time off end date"
                    });
                }
    
                const toffStartDate = new Date(body.timeOffStartDate);
                const toffEndDate = new Date(body.timeOffEndDate);
    
                if (toffStartDate.getTime() > toffEndDate.getTime()) {
                    return res.status(400).send({
                        success: false,
                        message: "Time off start date cannot be greater than time off end date"
                    });
                }
                
                if (body.wStartDate === "" || !body.wStartDate) {
                    return res.status(400).send({
                        success: false,
                        message: "Please select work start date"
                    });
                }
    
                const dateOptions = new Date();
                const wStartDate = new Date(body.wStartDate);
                
                dateOptions.setDate(toffEndDate.getDate() + 1);
    
                if (wStartDate.getTime() > dateOptions.getTime() || wStartDate.getTime() < toffEndDate.getTime()) {
                    return res.status(400).send({
                        success: false,
                        message: "Please choose correct work start date"
                    });
                }
            }

            const user_id = req.user.id;
            const employee = await getUserDataAsEmployee(user_id);
            body.user_id = user_id;
            body.emp_id = employee[0].id;

            addTimeOff(body, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        success: false,
                        message: "Ups.. Something went wrong!"
                    });
                }
                console.log(result);
                return res.status(200).send({
                    success: true,
                    message: "Time off request added"
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups.. Something went wrong!"
            });
        }
    },
    getSalaryByMonthsForUser: async (req, res) => {
        try {
            const data = req.body;
            const user_id = req.user.id;
            const offset = parseInt(req.params.offset);
            const employee = await getUserDataAsEmployee(user_id);
            const emp_id = employee[0].id;
            data.emp_id = emp_id;
            data.offset = offset;
            const result = await getSalaryByMonthsForUser(data);

            return res.status(200).send({
                success: true,
                salaries: result.salaries,
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
    getUserTimeOffs: async (req, res) => {
        try {
            const query = req.query;
            const user_id = req.user.id;

            let limit, offset;

            if (query.limit && !isNaN(parseInt(query.limit))) {
                limit =  parseInt(query.limit);
            } else {
                limit = 15
            }

            if (query.offset && !isNaN(parseInt(query.offset))) {
                offset = parseInt(query.offset);
            } else {
                offset = 0;
            }

            offset = offset * limit;
            
            const timeOffData = await getUserTimeOffs(user_id, limit, offset);

            return res.status(200).send({
                success: true,
                myTimeOffs: timeOffData.myTimeOffs,
                myTimeOffsCount: timeOffData.myTimeOffsCount
            });
            
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    changePassword: async (req, res) => {
        try {
            const user_id = req.user.id;
            const password = await getUserPassword(user_id);
            const body = req.body;
            const oldPassword = body.oldPassword;
            const newPassword = body.password;
            const confirmPassword = body.confirmPassword;
            const userData = {};
            userData.user_id = user_id;
            bcrypt.compare(oldPassword, password[0].password, (err, isMatch) => {
                console.log(body);
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: "Old password is not correct. Please try again!"
                    });
                }
                if (isMatch) {
                    if (newPassword !== confirmPassword) {
                        return res.status(400).send({
                            success: false,
                            message: "Passwords should match."
                        });
                    } else {
                        userData.password = newPassword;
                        changePassword(userData, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(400).send({
                                    success: "An unknown error has been occurred. Please contact system admin."
                                });
                            }
                            return res.status(201).send({
                                success: true,
                                message: "Password has been changed please log in again"
                            });
                        })
                    }
                } else {
                    return res.status(400).send({
                        success: false,
                        message: "Old password is not correct. Please try again!"
                    });
                }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    exportSalariesToExcel: async (req, res) => {
        try {
            const user_id = req.user.id;
            const body = req.body;
            body.user_id = user_id;
            const date = new Date();
            const filename = `${date.getTime()}-əmək-haqqı.xlsx`;
            let salaries = await getAllSalariesForUser(body);
            const workbook = new excelJS.Workbook();
            const worksheet = workbook.addWorksheet("Əmək Haqqı Profil");
            worksheet.columns= [
                {header: "Alınan Maaş", key: "salary_cost", width: 10},
                {header: "Alındığı Tarix", key: "salary_date", width: 10},
                {header: "A.S.A", key: "full_name", width: 10},
            ];
            salaries.forEach(salary => {
                const salaryDataFromDB = {
                    salary_cost: salary.salary_cost,
                    salary_date: salary.salary_date,
                    full_name: `${salary.first_name} ${salary.last_name} ${salary.father_name}`
                };
                console.log(salary);
                worksheet.addRow(salaryDataFromDB);
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
            res.download(excelPath, "Əmək-Haqqları.xlsx");
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}