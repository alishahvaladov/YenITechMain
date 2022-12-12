const {
    getDepartment,
    getPosition,
    getEmployee,
    empRenderPage,
    empRenderByPage,
    updateEmployee,
    getUserName,
    getDeletedEmployees,
    addEmploye,
    getSSN,
    getFIN,
    getPhoneNumber,
    getDifferences
} = require("./service");
const { addNotification } = require("../../notification/service");
const excelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const standardShiftTypes = require("../../config/config.json").shift_types[1].types;
const validateEmployee = async (data,  emp_id = null, cb) => {
    const dbData = {};
    const validationError = {};
    let fName;
    let fNameError = [];
    let lName;
    let lNameError = [];
    let fatherName;
    let fatherNameError = [];
    let ssnError = [];
    const selectedShiftType = data.select_shift_type;
    const shiftType = data.shift_type;
    const shiftData = {};

    if (data.employeeName !== "" && data.employeeName !== undefined && data.employeeName !== null) {
        fName = data.employeeName;
        for (let i = 0; i < fName.length; i++) {
            if(!isNaN(parseInt(fName[i]))) {
                console.log("First name cannot contain number");
                validationError.employeeName = "First name cannot contain number";
                return cb(true, validationError);
            }

            if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(fName[i]) === false) {
                console.log("First name cannot contain symbol");
                validationError.employeeName = "First name cannot contain symbol";
                return cb(true, validationError);
            }
        }
        dbData.first_name = fName;
    } else {
        validationError.employeeName = "Please fill first name";
        return cb(true, validationError);
    }
    if (data.employeeLastName !== "" && data.employeeLastName !== undefined && data.employeeLastName !== null) {
        lName = data.employeeLastName;
        for (let i = 0; i < lName.length; i++) {
            if(!isNaN(parseInt(lName[i]))) {
                console.log("First name cannot contain number");
                validationError.employeeLastName = "First name cannot contain number";
                return cb(true, validationError);
            }

            if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(lName[i]) === false) {
                console.log("First name cannot contain symbol");
                validationError.lName = "First name cannot contain symbol";
                return cb(true, validationError);
            }
        }
        dbData.last_name = lName;
    } else {
        validationError.employeeLastName = "Please fill last name";
        return cb(true, validationError);
    }
    if (data.employeeFatherName !== "" && data.employeeFatherName !== undefined && data.employeeFatherName !== null) {
        fatherName = data.employeeFatherName;
        for (let i = 0; i < fatherName.length; i++) {
            if(!isNaN(parseInt(fatherName[i]))) {
                console.log("First name cannot contain number");
                validationError.employeeFatherName = "First name cannot contain number";
                return cb(true, validationError);
            }

            if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(fatherName[i]) === false) {
                console.log("First name cannot contain symbol");
                validationError.employeeFatherName = "First name cannot contain symbol";
                return cb(true, validationError);
            }
        }
        dbData.father_name = fatherName;
    } else {
        validationError.employeeFatherName = "Please fill father name";
        return cb(true, validationError);
    }
    if (data.sex !== "" && data.sex !== undefined && data.sex !== null) {
        if (parseInt(data.sex) === 0 || parseInt(data.sex) === 1) {
            dbData.sex = data.sex;
        } else {
            validationError.sex = "Chosen gender is not allowed";
            return cb(true, validationError);
        }
    } else {
        validationError.sex = "Please choose gender";
        return cb(true, validationError);
    }
    if (data.dob !== "" && data.dob !== undefined && data.dob !== null) {
        dbData.dob = data.dob;
    } else {
        validationError.dob = "Please choose date of birth";
        return cb(true, validationError);
    }
    if (data.q_address !== "" && data.q_address !== undefined && data.q_address !== null) {
        if (data.q_address.length < 10) {
            validationError.q_address = "Length of address must be greater than 10";
            return cb(true, validationError);
        }
        dbData.q_address = data.q_address;
    } else {
        validationError.q_address = "Please fill q_address";
        return cb(true, validationError);
    }
    if (data.y_address !== "" && data.y_address !== undefined && data.y_address !== null) {
        if (data.y_address !== "" && data.y_address !== undefined && data.y_address !== null) {
            if (data.q_address.length < 10) {
                validationError.y_address = "Length of address must be greater than 10";
                return cb(true, validationError);
            }
            dbData.y_address = data.y_address;
        }
    } else {
        dbData.y_address = data.q_address;
    }
    if (data.SSN !== "" && data.SSN !== undefined && data.SSN !== null) {
        let SSN = data.SSN;
        const seperatedSSN = SSN.split('');
        if(seperatedSSN.length !== 13) {
            console.log("SSN must be 13 numbers");
            validationError.SSN = "SSN must be 13 numbers";
            return cb(true, validationError);
        }
        for (let i = 0; i < seperatedSSN.length; i++) {
            if((/[0-9]/).test(seperatedSSN[i]) === false) {
                console.log("SSN cannot contain letter or symbol");
                validationError.SSN = "SSN cannot contain letter or symbol";
                return cb(true, validationError);
            }
        }
        const dbSSN = await getSSN(SSN, emp_id);
        if (dbSSN.length > 0) {
            validationError.SSN = "Bu SSN bazada mövcuddur";
            return cb(true, validationError);
        }
        dbData.SSN = SSN;
    } else {
        validationError.SSN = "Please fill SSN";
        return cb(true, validationError);
    }
    if (data.FIN !== "" && data.FIN !== undefined && data.FIN !== null) {
        const FIN = data.FIN;
        const finError = [];
        if(FIN.length !== 7) {
            console.log("FIN must be 7 length long");
            validationError.FIN = "FIN must be 7 length long";
            return cb(true, validationError);
        }
        for (let i = 0; i < FIN.length; i++) {
            if((/[a-zA-Z0-9]/).test(FIN[i]) === false) {
                console.log("FIN cannot contain symbol");
                validationError.FIN = "FIN cannot contain symbol";
                return cb(true, validationError);
            }
        }
        const dbFIN = await getFIN(FIN, emp_id);
        if (dbFIN.length > 0) {
            validationError.FIN = "Bu FIN bazada mövcuddur";
            return cb(true, validationError);
        }
        dbData.FIN = FIN;
    } else {
        validationError.FIN = "Please fill FIN";
        return cb(true, validationError);
    }
    if (data.phoneNumber !== "" && data.phoneNumber !== undefined && data.phoneNumber !== null) {
        let phoneNumber = data.phoneNumber.replaceAll(" ", "");
        phoneNumber = phoneNumber.replaceAll("(", "");
        phoneNumber = phoneNumber.replaceAll(")", "");
        if(phoneNumber.length === 9) {
            const seperatedP = phoneNumber.split("");
            for (let i = 0; i < seperatedP.length; i++) {
                if(isNaN(parseInt(seperatedP[i]))) {
                    console.log("Phone number should be only numbers!");
                    validationError.phoneNumber = "Phone number should be only numbers!";
                    return cb(true, validationError);
                }
            }
            const phone_number = await getPhoneNumber(phoneNumber, emp_id);
            if (phone_number.length > 0) {
                validationError.phoneNumber = "Bu nömrə artıq mövcuddur";
                return cb(true, validationError);
            }
        } else {
            validationError.phoneNumber = "Phone number should be 9 characters!";
            return cb(true, validationError);
        }
        dbData.phone_number = phoneNumber.toString();
    } else {
        validationError.phoneNumber = "Please fill phone number";
        return cb(true, validationError);
    }
    if (data.homeNumber !== "" && data.homeNumber !== undefined && data.homeNumber !== null) {
        const homeNumber = data.homeNumber;
        const homeNumberError = [];
        if (homeNumber === '' || homeNumber === null) {
            homeNumber = null;
        } else if(homeNumber.length === 12 || homeNumber.length === 12) {
            for (let i = 0; i < seperatedH.length; i++) {
                if(isNaN(parseInt(seperatedH[i]))) {
                    console.log("Home number should be only numbers!");
                    validationError.homeNumber = "Home number should be only numbers!";
                    return cb(true, validationError);
                }
            }
        } else {
            console.log("Home number should be 10 or 12 characters!");
            validationError.homeNumber = "Home number should be 10 or 12 characters!";
            return cb(true, validationError);
        }
        dbData.homeNumber = homeNumber;
    }


    if(parseInt(selectedShiftType) === 1) {
        if(parseInt(shiftType) === 1 || parseInt(shiftType) === 2 || parseInt(shiftType) === 3) {
                shiftData.shift_type = shiftType;
                shiftData.shift_start = null;
                shiftData.shift_end = null;
        } else {
            validationError.shift_type = "Wrong shift type selected please try again";
            return cb(true, validationError);
        }
    } else if(parseInt(selectedShiftType) === 2) {
        const shiftStartT = data.shift_start_t;
        const shiftEndT = data.shift_end_t;
        if(shiftStartT === "" || shiftStartT === null || shiftEndT === "" || shiftEndT === null) {
            validationError.shift_start_t = "Please fill shift times";
            validationError.shift_end_t = "Please fill shift times";
            return cb(true, validationError);
        }

        try {
            const splittedShiftStart = data.shift_start_t.split(":");
            const splittedShiftEnd = data.shift_end_t.split(":");
            if (parseInt(splittedShiftStart[0]) - parseInt(splittedShiftEnd[0]) > 0) {
                validationError.shift_start_t = "Shift start cannot be greater than shift end";
                return cb(true, validationError);
            }
            shiftData.shift_type = null;
            shiftData.shift_start = shiftStartT;
            shiftData.shift_end = shiftEndT;
        } catch (err) {
            console.log(err);
            validationError.shift_start_t = "Please choose correct shift time type.";
            validationError.shift_end_t = "Please choose correct shift time type.";
            return cb(true, validationError);
        }
    } else {
        validationError.select_shift_type = "Please select shift type";
        return cb(true, validationError);
    }

    if (data.j_start_date !== "" && data.j_start_date !== undefined && data.j_start_date !== null) {
        try {
            // const j_start_date = data.j_start_date.split("-");
            // if(parseInt(j_start_date[0]) <= year && parseInt(j_start_date[1]) < month) {
            //     console.log("Maximum range for Job Start Date is 1 month");
            //     validationError.jStartDate = "Maximum range for Job Start Date is 1 month";
            //     return cb(true, validationError);
            // }
            // if (parseInt(j_start_date[0]) >= year && parseInt(j_start_date[1]) >= month + 1 && parseInt(j_start_date[2]) > day) {
            //     console.log("You cannot add employee (a day/days) after from today!");
            //     validationError.jStartDate = "You cannot add employee (a day/days) after from today!";
            //     return cb(true, validationError);
            // }
            dbData.j_start_date = data.j_start_date;
        } catch (error) {
            console.log(error);
            validationError.j_start_date = "Please choose correct job start date";
            return cb(true, validationError);
        }
    } else {
        validationError.j_start_date = "Please choose job start date";
        return cb(true, validationError);
    }
    if (data.dayoff_days_total !== "" && data.dayoff_days_total !== undefined && data.dayoff_days_total !== null) {
        const dayOffDays = data.dayoff_days_total;
        if(isNaN(parseInt(dayOffDays))) {
            console.log("Please enter valid day off dates");
            validationError.dayoff_days_total = "Please enter valid day off dates";
            return cb(true, validationError);
        }
        dbData.dayoff_days_total = dayOffDays;
    } else {
        validationError.dayoff_days_total = "Please choose day off dates";
        return cb(true, validationError);
    }

    if (data.full_day !== "" && data.full_day !== undefined && data.full_day !== null) {
        const fDay = data.full_day;
        if(fDay === 'on') {
            dbData.working_days = 77;
        } else {
            if (data.workingDays !== "" && data.workingDays !== undefined && data.workingDays !== null) {
                const wDays = data.workingDays;
                if (parseInt(wDays) > 26) {
                    validationError.workingDays = "Working days cannot be greater than maximum working day limit";
                    return cb(true, validationError);
                } else if(isNaN(parseInt(wDays))) {
                    validationError.workingDays = "Please enter valid working days";
                    return cb(true, validationError);
                } else {
                    dbData.working_days = parseInt(wDays);
                }
            } else {
                validationError.workingDays = "Please fill working days";
                return cb(true, validationError);
            }
        }
    }
    

    if (data.project !== "" && data.project !== undefined && data.project !== null) {
        const project = data.project;
        if(isNaN(parseInt(project))) {
            console.log("Please enter valid project");
            validationError.project = "Please enter valid project";
            return cb(true, validationError);
        }
        dbData.project_id = project;
    } else {
        validationError.project = "Please enter project";
        return cb(true, validationError);
    }
    if (data.department !== "" && data.department !== undefined && data.department !== null) {
        const department = data.department;
        if(isNaN(parseInt(department))) {
            console.log("Please enter valid department");
            validationError.department = "Please enter valid department";
            return cb(true, validationError);
        }
        dbData.department = department;
    } else {
        validationError.department = "Please enter department";
        return cb(true, validationError);
    }
    if (data.group_id !== "" && data.group_id) {
        const groupID = data.group_id;
        if(isNaN(parseInt(groupID))) {
            console.log("Please enter valid group");
            validationError.group_id = "Please enter valid group";
            return cb(true, validationError);
        }
        dbData.group_id = groupID;
    }
    if (data.position !== "" && data.position !== undefined && data.position !== null) {
        const position = data.position;
        if(isNaN(parseInt(position))) {
            console.log("Please enter valid position");
            validationError.position = "Please enter valid position";
            return cb(true, validationError);
        }
        dbData.position_id = position;
    } else {
        validationError.position = "Please enter position";
        return cb(true, validationError);
    }
    
    

    return cb(null, null, dbData, shiftData);
}

module.exports = {
    getDepartment: async (req, res) => {
        const id = req.body.id;
        const result = await getDepartment(id);
        res.send({
            result: result
        });
    },
    getPosition: async (req, res) => {
        const projID = req.body.projID;
        const deptID = req.body.deptID;

        const result = await getPosition(deptID, projID);

        res.send({
            result: result
        });
    },
    getEmployee: async (req, res) => {
        const id = req.body.emp_id;
        try {
            let result = await getEmployee(id);
            const shiftType = result.empRes[0].shift_type;
            if (parseInt(shiftType) === 1) {
                result.empRes[0].shift_start = standardShiftTypes[0].shift_start;
                result.empRes[0].shift_end = standardShiftTypes[0].shift_end;
            } else if (parseInt(shiftType) === 2) {
                result.empRes[0].shift_start = standardShiftTypes[1].shift_start;
                result.empRes[0].shift_end = standardShiftTypes[1].shift_end;
            } else if (parseInt(shiftType) === 3) {
                result.empRes[0].shift_start = standardShiftTypes[2].shift_start;
                result.empRes[0].shift_end = standardShiftTypes[3].shift_end;
            }
            let uploadedFiles = result.empRes[0].uploaded_files;
            if (result.empRes[0].working_days === 77) {
                result.empRes[0].working_days = "full_day";
            }
            result.empRes[0].uplaoded_files = {};
            uploadedFiles = JSON.parse(uploadedFiles);
            if (uploadedFiles && uploadedFiles.reqruitment) {
                uploadedFiles = JSON.parse(uploadedFiles.recruitment);
                result.empRes[0].filename = uploadedFiles.profilePicture[0].filename;
            }
            res.send({
                result: result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    empRenderPage: async (req, res) => {
        try {
            let body = req.body;
            let result = await empRenderPage(body);
            let role = '';
            if(req.user.role === 1) {
                role = 'super_admin'
            } else if (req.user.role === 5) {
                role = 'hr';
            }
            return res.send({
                result: result.result,
                count: result.count,
                role
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                error: "An unknown error has been occurred"
            });
        }
    },
    empRenderByPage: async (req, res) => {
        try {
            const body = req.body;
            let role = req.user.role;
            if (role === 5) {
                role = "hr";
            } else if (role === 1) {
                role = "super_admin"
            }
            let offset = req.body.offset;
            offset = (offset - 1) * parseInt(body.limit);
            let result = await empRenderByPage(offset, body);
            res.send({
                result,
                role
            });
        } catch (e) {
            console.log(e);
            req.flash("error_msg", "An unknown error has been occurred");
            return res.redirect("/employees");
        }
    },
    exportDataToExcel: async (req, res) => {
        const data = req.body;
        const date = new Date();
        const filename = `${date.getTime()}-əməkdaşlar.xlsx`;
        let offset = req.body.offset;
        offset = (offset - 1) * 10;
        let empData = await empRenderPage(data);
        empData = empData.result;
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Əməkdaşlar");
        worksheet.columns= [
            {header: "Adı", key: "first_name", width: 10},
            {header: "Soyadı", key: "last_name", width: 10},
            {header: "Ata adı", key: "father_name", width: 10},
            {header: "Cinsiyyətti", key: "sex", width: 10},
            {header: "Doğum tarixi", key: "dob", width: 10},
            {header: "Qeydiyyatda olduğu ünvan", key: "q_address", width: 10},
            {header: "Faktiki ünvan", key: "y_address", width: 10},
            {header: "SSN", key: "SSN", width: 10},
            {header: "FIN", key: "FIN", width: 10},
            {header: "Mobil telefon nömrəsi", key: "phone_number", width: 10},
            {header: "Ev telefon nömrəsi", key: "home_number", width: 10},
            {header: "İşə gəlmə saatı", key: "shift_start_t", width: 10},
            {header: "İşdən ayrılma saatı", key: "shift_end_t", width: 10},
            {header: "İşə başlama tarixi", key: "j_start_date", width: 10},
            {header: "İşdən ayrılma tarixi", key: "j_end_date", width: 10},
            {header: "Ümumi məzuniyyəti", key: "dayoff_days_total", width: 10},
            {header: "Layihə", key: "projName", width: 10},
            {header: "Departament", key: "deptName", width: 10},
            {header: "Vəzifə", key: "posName", width: 10},
            {header: "İş günləri", key: "working_days", width: 10}
        ]
        empData.forEach(employee => {
            const empDataFromDB = {
                first_name: employee.first_name,
                last_name: employee.last_name,
                father_name: employee.father_name,
                sex: employee.sex,
                dob: employee.dob,
                q_address: employee.q_address,
                y_address: employee.y_address,
                SSN: employee.SSN,
                FIN: employee.FIN,
                phone_number: employee.phone_number,
                home_number: employee.home_number,
                shift_start_t: employee.shift_start_t,
                shift_end_t: employee.shift_end_t,
                j_start_date: employee.j_start_date,
                j_end_date: employee.j_end_date,
                dayoff_days_total: employee.dayoff_days_total,
                projName: employee.projName,
                deptName: employee.deptName,
                posName: employee.posName,
                working_days: employee.working_days
            };
            worksheet.addRow(empDataFromDB);
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
        res.download(excelPath, "Əməkdaşlar.xlsx");
    },
    updateEmployee: (req, res) => {
        try {
            const body = req.body.data;
            const user_id = req.user.id;
            const notificationData = {};
            const emp_id = body.employeeId;
            validateEmployee(body, emp_id, (err, message, empData, shiftData) => {
                if (err) {
                    for (const [key, value] of Object.entries(message)) {
                        console.log(`Error of ${key} is ${value}`);
                        return res.status(400).send({
                            success: false,
                            message: value
                        });
                    }
                }
                empData.user_id = user_id;
                empData.id = body.employeeId;
                shiftData.emp_id = body.employeeId;
                updateEmployee(empData, shiftData, async (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({
                            success: false,
                            message: "Internal server error has been occurred. Please contact system admin"
                        });
                    }
                    const username = await getUserName(user_id);
                    notificationData.header = "Əməkdaş məlumatlarında düzəliş olundu";
                    notificationData.description = `${empData.first_name} ${empData.last_name} ${empData.father_name} adlı əməkdaşın məlumatlarında ${username[0].username} dəyişiklik etdi.`;
                    notificationData.created_by = user_id;
                    notificationData.belongs_to_role = 7;
                    notificationData.belongs_to_table = "Employees";
                    notificationData.url = "/employee";
                    notificationData.importance = 1;
                    addNotification(notificationData, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({
                                success: false,
                                message: "Ups... Something went wrong!"
                            });
                        }
                        return res.status(200).send({
                            success: true,
                            message: "Employee has been updated successfully"
                        });
                    });
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getDeletedEmployees: async (req, res) => {
        try {
            const body = req.body;
            const result = await getDeletedEmployees(body);
            return res.status(200).send({
                success: true,
                result
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    },
    addEmployee: (req, res) => {
        try {
            const body = req.body;
            validateEmployee(body, null,  (err, message, empData, shiftData) => {
                if (err) {
                    console.log(empData);
                    console.log(err);
                    return res.status(400).send({
                        success: false,
                        message
                    });
                }
                empData.user_id = req.user.id;
                addEmploye(empData, shiftData, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).send({
                            success: false,
                            message: "Missing data. Please try again."
                        });
                    }
                    return res.status(200).send({
                        success: true,
                        message: "Employee has been added",
                        emp_id: result.id
                    });
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

// getDifferences(null, 998).then(console.log)