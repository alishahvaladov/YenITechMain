const { getDepartment, getPosition, getEmployee, empRenderPage, getEmpCount, empRenderByPage, updateEmployee } = require("./service");
const excelJS = require("exceljs");
const path = require("path");
const standardShiftTypes = require("../../config/config.json").shift_types[1].types;
const fs = require("fs");
const validateEmployee = (data, cb) => {
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
                fNameError.push = "First name cannot contain number";
                validationError.fName = fNameError;
                return cb(true, validationError);
            }

            if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(fName[i]) === false) {
                console.log("First name cannot contain symbol");
                fNameError.push("First name cannot contain symbol");
                validationError.fName = fNameError;
                return cb(true, validationError);
            }
        }
        dbData.first_name = fName;
    }
    if (data.employeeLastName !== "" && data.employeeLastName !== undefined && data.employeeLastName !== null) {
        lName = data.employeeLastName;
        for (let i = 0; i < lName.length; i++) {
            if(!isNaN(parseInt(lName[i]))) {
                console.log("First name cannot contain number");
                lNameError.push = "First name cannot contain number";
                validationError.lName = lNameError;
                return cb(true, validationError);
            }

            if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(lName[i]) === false) {
                console.log("First name cannot contain symbol");
                lNameError.push("First name cannot contain symbol");
                validationError.lName = lNameError;
                return cb(true, validationError);
            }
        }
        dbData.last_name = lName;
    }
    if (data.employeeFatherName !== "" && data.employeeFatherName !== undefined && data.employeeFatherName !== null) {
        fatherName = data.employeeFatherName;
        for (let i = 0; i < fatherName.length; i++) {
            if(!isNaN(parseInt(fatherName[i]))) {
                console.log("First name cannot contain number");
                fatherNameError.push = "First name cannot contain number";
                validationError.fatherName = fatherNameError;
                return cb(true, validationError);
            }

            if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(fatherName[i]) === false) {
                console.log("First name cannot contain symbol");
                lNameError.push("First name cannot contain symbol");
                validationError.fatherName = fatherNameError;
                return cb(true, validationError);
            }
        }
        dbData.father_name = fatherName;
    }
    if (data.sex !== "" && data.sex !== undefined && data.sex !== null) {
        if (parseInt(data.sex) === 0 || parseInt(data.sex) === 1) {
            dbData.sex = data.sex;
        } else {
            validationError.sex = "Chosen gender is not allowed";
            return cb(true, validationError);
        }
    }
    if (data.dob !== "" && data.dob !== undefined && data.dob !== null) {
        dbData.dob = data.dob;
    }
    if (data.q_address !== "" && data.q_address !== undefined && data.q_address !== null) {
        if (data.q_address.length < 10) {
            validationError.q_address = "Length of address must be greater than 10";
            return cb(true, validationError);
        }
        dbData.q_address = data.q_address;
    }
    if (data.y_address !== "" && data.y_address !== undefined && data.y_address !== null) {
        if (data.y_address !== "" && data.y_address !== undefined && data.y_address !== null) {
            if (data.q_address.length < 10) {
                validationError.y_address = "Length of address must be greater than 10";
                return cb(true, validationError);
            }
            dbData.y_address = data.y_address;
        }
    }
    if (data.SSN !== "" && data.SSN !== undefined && data.SSN !== null) {
        let SSN = data.SSN;
        const seperatedSSN = SSN.split('');
        if(seperatedSSN.length !== 13) {
            console.log("SSN must be 13 numbers");
            ssnError.push("SSN must be 13 numbers")
            validationError.ssn = ssnError;
            return cb(true, validationError);
        }
        for (let i = 0; i < seperatedSSN.length; i++) {
            if((/[0-9]/).test(seperatedSSN[i]) === false) {
                console.log("SSN cannot contain letter or symbol");
                ssnError.push("SSN cannot contain letter or symbol")
                validationError.ssn = ssnError;
                return cb(true, validationError);
            }
        }
        dbData.ssn = SSN;
    }
    if (data.FIN !== "" && data.FIN !== undefined && data.FIN !== null) {
        const FIN = data.FIN;
        const finError = [];
        if(FIN.length !== 7) {
            console.log("FIN must be 7 length long");
            finError.push("FIN must be 7 length long")
            validationError.fin = finError;
            return cb(true, validationError);
        }
        for (let i = 0; i < FIN.length; i++) {
            if((/[a-zA-Z0-9]/).test(FIN[i]) === false) {
                console.log("FIN cannot contain symbol");
                finError.push("FIN cannot contain symbol")
                validationError.fin = finError;
                return cb(true, validationError);
            }
        }
        dbData.FIN = FIN;
    }
    if (data.phoneNumber !== "" && data.phoneNumber !== undefined && data.phoneNumber !== null) {
        const phoneNumber = data.phoneNumber;
        const phoneNumberError = [];
        if(phoneNumber.length === 10 || phoneNumber.length === 12) {
            const seperatedP = phoneNumber.replace(" ", "").split("");
            for (let i = 0; i < seperatedP.length; i++) {
                if(isNaN(parseInt(seperatedP[i]))) {
                    console.log("Phone number should be only numbers!");
                    phoneNumberError.push("Phone number should be only numbers!");
                    validationError.phoneNumber = phoneNumberError;
                    return cb(true, validationError);
                }
            }
        } else {
            console.log("Phone number should be 10 or 12 characters!");
            phoneNumberError.push("Phone number should be 10 or 12 characters!");
            validationError.phoneNumber = phoneNumberError;
            return cb(true, validationError);
        }
        dbData.phone_number = phoneNumber.toString();
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
                    homeNumberError.push("Home number should be only numbers!");
                    validationError.homeNumber = homeNumberError;
                    return cb(true, validationError);
                }
            }   
        } else {
            console.log("Home number should be 10 or 12 characters!");
            homeNumberError.push("Home number should be 10 or 12 characters!");
            validationError.homeNumber = homeNumberError;
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
            validationError.shift = "Wrong shift type selected please try again";
            return cb(true, validationError);
        }
    } else if(parseInt(selectedShiftType) === 2) {
        const shiftStartT = data.shift_start_t;
        const shiftEndT = data.shift_end_t;
        if(shiftStartT === "" || shiftStartT === null || shiftEndT === "" || shiftEndT === null) {
            validationError.shift = "Please fill shift times";
            return cb(true, validationError);
        }

        try {
            const splittedShiftStart = data.shift_start_t.split(":");
            const splittedShiftEnd = data.shift_end_t.split(":");
            if (parseInt(splittedShiftStart[0]) - parseInt(splittedShiftEnd[0]) > 0) {
                validationError.shift = "Shift start cannot be greater than shift end";
                return cb(true, validationError);
            }
            shiftData.shift_type = null;
            shiftData.shift_start = shiftStartT;
            shiftData.shift_end = shiftEndT;
        } catch (err) {
            console.log(err);
            validationError.shift = "Please choose correct shift time type.";
            return cb(true, validationError);
        }
    }

    if (data.j_start_date !== "" && data.j_start_date !== undefined && data.j_start_date !== null) {
        try {
            const j_start_date = data.j_start_date.split("-");
            if(parseInt(j_start_date[0]) <= year && parseInt(j_start_date[1]) < month) {
                console.log("Maximum range for Job Start Date is 1 month");
                validationError.jStartDate = "Maximum range for Job Start Date is 1 month";
                return cb(true, validationError);
            }
            if (parseInt(j_start_date[0]) >= year && parseInt(j_start_date[1]) >= month + 1 && parseInt(j_start_date[2]) > day) {
                console.log("You cannot add employee (a day/days) after from today!");
                validationError.jStartDate = "You cannot add employee (a day/days) after from today!";
                return cb(true, validationError);
            }
            dbData.j_start_date = data.j_start_date;
        } catch (error) {
            console.log(error);
            validationError.jStartDate = "Please choose correct day";
            return cb(true, validationError);
        }
    }
    if (data.dayOffDays !== "" && data.dayoffDays !== undefined && data.dayoffDays !== null) {
        const dayOffDays = data.dayoffDays;
        if(isNaN(parseInt(dayOffDays))) {
            console.log("Please enter valid day off dates");
            validationError.dayOffDays = "Please enter valid day off dates";
            return cb(true, validationError);
        }
        dbData.dayoff_days_total = dayOffDays;
    }

    if (data.full_day !== "" && data.full_day !== undefined && data.full_day !== null) {
        if (data.workingDays !== "" && data.workingDays !== undefined && data.workingDays !== null) {
            const fDay = data.full_day;
            const wDays = data.workingDays; 
            if(fDay === 'on') {
                dbData.working_days = 77;
            } else if (parseInt(wDays) > 26) {
                validationError.wDay = "Working days cannot be greater than maximum working day limit";
                return cb(true, validationError);
            } else if(isNaN(parseInt(wDays))) {
                validationError.wDay = "Please enter valid working days";
                return cb(true, validationError);
            } else {
                dbData.working_days = parseInt(wDays); 
            }
        }
    }
    
    if (data.department !== "" && data.department !== undefined && data.department !== null) {
        const department = data.department;
        if(isNaN(parseInt(department))) {
            console.log("Please enter valid department");
            validationError.department = "Please enter valid department";
            return cb(true, validationError);
        }
        dbData.department = department;
    }
    if (data.position !== "" && data.position !== undefined && data.position !== null) {
        const position = data.position;
        if(isNaN(parseInt(position))) {
            console.log("Please enter valid position");
            validationError.position = "Please enter valid position";
            return cb(true, validationError);
        }
        dbData.poisiton_id = position;
    }
    if (data.project !== "" && data.project !== undefined && data.project !== null) {
        const project = data.project;
        if(isNaN(parseInt(project))) {
            console.log("Please enter valid project");
            validationError.project = "Please enter valid project";
            return cb(true, validationError);
        }
        dbData.project_id = project;
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
            if (uploadedFiles) {
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
            return res.send({
                error: "An unknown error has been occurred"
            })
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
            offset = (offset - 1) * 10;
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
        const body = req.body.data;
        const user_id = req.user.id;
        validateEmployee(body, (err, message, empData, shiftData) => {
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
            updateEmployee(empData, shiftData, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        success: false,
                        message: "Internal server error has been occurred. Please contact system admin"
                    });
                }
                console.log(result);
                return res.status(200).send({
                    success: true,
                    message: "Employee has been updated successfully"
                });
            });
        });
    }
}