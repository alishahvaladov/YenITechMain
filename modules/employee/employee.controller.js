const {
    addEmployee,
    deleteEmployee,
    getEmployees,
    updateEmployee,
    getEmployee,
    updateJEnd,
    renderAddEmployeeForDept,
    renderAddEmployeeForPj,
    renderAddEmployeeForPos,
    getEmployeeRemoveModule,
    addFileNames,
    checkIfEmpFileExists,
    deleteEmpFiles,
    updateFileNames,
    checkIfEmpExists,
    addLogixDataToLogixDB,
    checkIfTabelNoExists
} = require("./employee.service");
const { addSalary, addTimeOffLeftToDB } = require('../salary/salary.service');
const { Employee } = require("../../db_config/models");
const {Op} = require("sequelize");
const path = require("path");
const fs = require("fs");
const excelJS = require("exceljs");
const workbook = new excelJS.Workbook();
const date = new Date();
let filePath = "";
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDate();
let errors = [];
let validationError = {};

const validateEmployee = async (data, cb) => {
        try {
            let fName, lName, fatherName, j_start_date;
            let fNameError = [];
            let lNameError = [];
            let fatherNameError = [];
            let ssnError = [];
            let dobError = [];
            let finError = [];
            let phoneNumberError = [];
            let homeNumberError = [];
            const shiftData = {};
            if (data.first_name === '') {
                fName = false;
            } else {
                fName = data.first_name.split('');
            }
            if (data.last_name === '') {
                lName = false;
            } else {
                lName = data.last_name.split('');
            }
            if (data.father_name === '') {
                fatherName = false;
            } else {
                fatherName = data.father_name.split('');
            }

            const tabelNo = data.tabel_no;
            const dob = data.dob;
            const SSN = data.SSN;
            const FIN = data.FIN;
            const phoneNumber = data.phone_number;
            let homeNumber = data.home_number;
            const shiftType = data.shift_type;
            const q_address = data.q_address.split('');
            let y_address;
            if(data.y_address === '') {
                y_address = null;
            } else {
                y_address = data.y_address;
            }
            const dayOffDays = data.dayoff_days_total;
            const wDays = data.working_days;
            const fDay = data.full_day;
            if(data.j_start_date === '') {
                j_start_date = false;
            } else {
                j_start_date = data.j_start_date.split("-");
            }
            const department = data.department;
            const position = data.position_id;
            const project = data.project_id;
            const date = new Date();
            const sex = data.sex;
            const selectedShiftType = data.select_shift_type;

            if(fName) {
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
            } else {
                console.log("Please enter Employee's First Name");
                fNameError.push("Please enter Employee's First Name");
                validationError.fName = fNameError;
                return cb(true, validationError);
            }

            if(lName) {
                for (let i = 0; i < lName.length; i++) {
                    if(!isNaN(parseInt(lName[i]))) {
                        console.log("Last name cannot contain number");
                        lNameError.push("Last name cannot contain number")
                        validationError.lName = lNameError;
                        return cb(true, validationError);
                    }
                    if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(lName[i]) === false) {
                        console.log("Last name cannot contain symbol");
                        lNameError.push("Last name cannot contain symbol")
                        validationError.lName = lNameError;
                        return cb(true, validationError);
                    }
                }
            } else {
                console.log("Please enter Employee's Last Name");
                lNameError.push("Please enter Employee's Last Name");
                validationError.lName = lNameError;
                return cb(true, validationError);
            }


            if(fatherName) {
                for (let i = 0; i < fatherName.length; i++) {
                    if(!isNaN(parseInt(fatherName[i]))) {
                        console.log("Father name cannot contain number");
                        fatherNameError.push("Father name cannot contain number")
                        validationError.fatherName = fatherNameError;
                        return false;
                    }
                    if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(fatherName[i]) === false) {
                        console.log("Father name cannot contain symbol");
                        fatherNameError.push("Father name cannot contain symbol")
                        validationError.fatherName = fatherNameError;
                        return false;
                    }
                }
            } else {
                console.log("Please enter Employee's Father Name");
                fatherNameError.push("Please enter Employee's Father Name");
                validationError.fatherName = fatherNameError;
                return false;
            }


            if(sex == 0 || sex == 1) {
                console.log("Gender verified");
            } else {
                console.log("Html interruption for sex: " + sex + "UserID" + req.user.id);
                validationError.sex("Please enter valid gender");
                return cb(true, validationError);
            }

            if (dob) {
                const sDOB = dob.split("-");
                if(isNaN(parseInt(sDOB[0])) === true || isNaN(parseInt(sDOB[1])) === true || isNaN(parseInt(sDOB[2])) === true) {
                    dobError.push("Please enter valid date for date of birth");
                    validationError.dob = dobError;
                    return cb(true, validationError);
                }
                if(parseInt(sDOB[0]) > date.getFullYear() - 16) {
                    dobError.push("This person's age is not enough to work. Please contact with Audit department to approve this person");
                    validationError.dob = dobError;
                    return cb(true, validationError);
                }
            }

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

            if(FIN) {
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
            }

            if(q_address) {
                if(q_address.length < 10) {
                    console.log("Q Address must be greater than 10 characters");
                    validationError.q_address = "Q Address must be greater than 10 characters";
                    return cb(true, validationError);
                }
            }

            if(y_address !== null) {
                if(y_address.length < 10) {
                    console.log("Y Address must be greater than 10 characters");
                    validationError.q_address = "Y Address must be greater than 10 characters";
                    return cb(true, validationError);
                }
            }


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

            data.phone_number = phoneNumber.toString();

            let seperatedH;

            if (homeNumber !== '' && homeNumber !== null) {
                seperatedH = homeNumber.replace(" ", "").split("");
            }

            if (homeNumber === '' || homeNumber === null) {
                homeNumber = null;
            } else if(homeNumber.length === 7 || homeNumber.length === 12) {
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

            if(parseInt(selectedShiftType) === 1) {
                if(parseInt(shiftType) === 1 || parseInt(shiftType) === 2 || parseInt(shiftType) === 3) {
                    shiftData.shift_type = parseInt(shiftType);
                    shiftData.shift_start = null;
                    shiftData.shift_end = null;
                } else {
                    validationError.shift = "Wrong shift type selected please try again";
                    return cb(true, validationError);
                }
            } else if(parseInt(selectedShiftType) === 2) {
                const splittedShiftStart = data.shift_start_t.split(":");
                const splittedShiftEnd = data.shift_end_t.split(":");
                if (parseInt(splittedShiftStart[0]) - parseInt(splittedShiftEnd[0]) > 0) {
                    validationError.shift = "Please choose valid shift times";
                    return cb(true, validationError);
                }
                const shiftStartT = data.shift_start_t;
                const shiftEndT = data.shift_end_t;
                shiftData.shift_type = null;
                shiftData.shift_start = data.shift_start_t;
                shiftData.shift_end = data.shift_end_t;
                if(shiftStartT === "" || shiftStartT === null || shiftEndT === "" || shiftEndT === null) {
                    validationError.shift = "Please fill shift times";
                    return cb(true, validationError);
                }
            } else {
                validationError.shift = "Please choose shift type";
                return cb(true, validationError);
            }

            if(j_start_date) {
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
            } else {
                console.log("Please enter Job Start Date!");
                validationError.jStartDate = "Please enter Job Start Date!";
                return cb(true, validationError);
            }

            if(isNaN(parseInt(dayOffDays))) {
                console.log("Please enter valid day off dates");
                validationError.dayOffDays = "Please enter valid day off dates";
                return cb(true, validationError);
            }

            if(fDay === 'on') {
                data.working_days = 77;
            } else if (parseInt(wDays) > 26) {
                validationError.wDay = "Working days cannot be greater than maximum working day limit";
                return cb(true, validationError);
            } else if(isNaN(parseInt(wDays))) {
                validationError.wDay = "Please enter valid working days";
                return cb(true, validationError);
            }

            if(isNaN(parseInt(department))) {
                console.log("Please enter valid department");
                validationError.department = "Please enter valid department";
                return cb(true, validationError);
            }

            if(isNaN(parseInt(position))) {
                console.log("Please enter valid position");
                validationError.position = "Please enter valid position";
                return cb(true, validationError);
            }

            if(isNaN(parseInt(project))) {
                console.log("Please enter valid project");
                validationError.project = "Please enter valid project";
                return cb(true, validationError);
            }

            if(tabelNo === "" || tabelNo === null) {
                validationError.tabelNo = "Please enter tabel no";
                return cb(true, validationError);
            } else {
                let checkTabel = await checkIfTabelNoExists(data.tabel_no);
                if (checkTabel.length > 0) {
                    validationError.tabelNo = "This tabel no already in use. Please write another one";
                    return cb(true, validationError);
                } 
            }

            return cb(null, null, data, shiftData);
        } catch (err) {
            console.log(err);
            validationError.error = "Ups... Something went wrong!";
            return cb(true, validationError);
        }
}

module.exports = {
    addEmployee: async (req, res) => {
        errors = [];
        const data = req.body;
        await validateEmployee(data, (err, message, result, shiftData) => {
            if (err) {
                for (const [key, value] of Object.entries(message)) {
                    console.log(`Error of ${key} is ${value}`);
                    req.flash("error_msg", value);
                    return res.redirect("/employee/add-employee");
                }
            }
            result.user_id = req.user.id;
            let logixData = {};
            Employee.findOne({
                where: {
                    SSN: result.SSN
                },
                logging: false
            }).then((employee) => {
                if(employee) {
                    console.log("This SSN already exists please check again");
                    req.flash("error_msg", "This SSN already exists please check again");
                    return res.redirect("/employee/add-employee");
                }
            });
    
            Employee.findOne({
                where: {
                    FIN: result.FIN
                },
                logging: false
            }).then((employee) => {
                if(employee) {
                    console.log("This FIN already exists please check again");
                    req.flash("error_msg", "This FIN already exists please check again");
                    return res.redirect("/employee/add-employee");
                }
                if (errors.length === 0) {
                    addEmployee(result, shiftData, (err, results) => {
                        if(err) {
                            console.log("Error" + err.message);
                            req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
                            return res.redirect("/employee/add-employee");
                        }
                        req.body.emp = results;
                        const empId = results.dataValues.id;
                        logixData.emp_id  = empId;
                        logixData.logix_name = data.logix_name;
                        logixData.tabel_no = data.tabel_no;
                        addLogixDataToLogixDB(logixData, (err, result) => {
                            if(err) {
                                console.log(err);
                                req.flash("error_msg", "An unknown error occured while adding logix data. Please contact system admin or try again.");
                                return res.redirect("/employee/update/" + empId);
                            }
                            req.flash("success_msg", "Employee has been added please fill employee data to continue");
                            return res.redirect("/employee/emp-files/" + empId);
                        });
                    }); 
                }
            });
        });
        
    },
    deleteEmployee: (req, res) => {
        const id = req.params.id;
        deleteEmployee(id, (err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "An unknown error has been occurred");
                return res.redirect("/employee");
            };
            req.flash("success_msg", "Employee has been deleted");
            return res.redirect('/employee');
        });
    },
    getEmployees: async (req, res) => {
        try {
            const result = await getEmployees();
            let dob;
            for (let i = 0; i < result.length; i++) {
                dob = result[i].dob.split("-").reverse().join('.');
                result[i].dob = dob;
            }
            return res.render("employee/employee", {
                employee: result,
                hr: true,
                hr_emp: true
            });
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "An unknown error occurred please contact System Admin")
            res.redirect("/employee");
        }
    },
    updateEmployee: async (req, res) => {
        errors = [];
        const data = req.body;
        const id = req.params.id;
        await validateEmployee(data, (err, message, validatedResult) => {
            if (err) {
                for (const [key, value] of Object.entries(message)) {
                    console.log(`Error of ${key} is ${value}`);
                    req.flash("error_msg", value);
                    return res.redirect("/employee/add-employee");
                }
            }
            validatedResult.user_id = req.user.id;
            Employee.findOne({
                where: {
                    SSN: validatedResult.SSN,
                    id: {
                        [Op.ne]: id
                    }
                }
            }).then((employee) => {
                if(employee) {
                    errors.push({msg: "This SSN already exists please check again"});
                    req.flash("error_msg", "This SSN already exists please check again");
                    return res.redirect("/employee/update/" + id);
                }
            });
    
            Employee.findOne({
                where: {
                    FIN: validatedResult.FIN,
                    id: {
                        [Op.ne]: id
                    }
                }
            }).then((employee) => {
                if(employee) {
                    errors.push({msg: "This FIN already exists please check again"});
                    req.flash("error_msg", "This FIN already exists please check again");
                    return res.redirect("/employee/update/" + id);
                }
                console.log(errors);
    
               if(errors.length !== 0) {
                   Employee.findOne({
                       where: {
                           id:id
                       }
                   }).then((result) => {
                       if(req.user.role === 5) {
                           return res.render("employee/update", {
                               hr: true,
                               employee: result.dataValues,
                               errors
                           });
                       } else if (req.user.role === 1) {
                           return res.render("employee/update", {
                               super_admin: true,
                               employee: result.dataValues,
                               errors
                           });
                       }
                   });
               }
    
                if (errors.length === 0) {
                    updateEmployee(id, validatedResult, (err, results) => {
                        if(err) {
                            console.log("Error" + err.message);
                            req.flash("error_msg", "An unknown error occurred");
                            return res.redirect("/employee/update" + id);
                        }
                        req.flash("success_msg", "An employee has been updated");
                        return  res.redirect("/employee/update/" + id);
                    })
                }
            });
        })


       
    },
    getEmployee: async (req, res) => {
        const id = req.params.id;
        const deptResult = await renderAddEmployeeForDept();
        const pjResult = await renderAddEmployeeForPj();
        const psResult = await renderAddEmployeeForPos();
        getEmployee(id, (err, result) => {
            if (err) {
                console.log(err);
                req.flash("error_msg", "An unknown error has been occurred");
                return res.redirect("/employees");
            }
            if(req.user.role === 5) {
                return res.render("employee/update", {
                    hr: true,
                    employee: result.dataValues,
                    deptResult,
                    pjResult,
                    psResult
                });
            } else if (req.user.role === 1) {
                return res.render("employee/update", {
                    super_admin: true,
                    employee: result.dataValues,
                    deptResult,
                    pjResult,
                    psResult
                });
            }
        });
    },
    updateJEnd: (req, res) => {
        const data = req.body;
        const id = req.params.id;

        updateJEnd(id, data, (err, result) => {
           if (err) {
               console.log(err);
               req.flash("error_msg", "An error has been occurred please contact System Admin");
               return res.redirect("/employee");
           }
           req.flash("An employee has been updated");
           return res.redirect("/employee");
        });
    },
    renderAddEmployee: async (req, res) => {
        try {
            const deptResult = await renderAddEmployeeForDept();
            const psResult =  await renderAddEmployeeForPos();
            const pjResult = await renderAddEmployeeForPj();
            if(req.user.role === 5) {
                return res.render("employee/add-employee", {
                    hr: true,
                    deptResult,
                    psResult,
                    pjResult
                });
            } else if (req.user.role === 1) {
                return res.render("employee/add-employee", {
                    super_admin: true,
                    deptResult,
                    psResult,
                    pjResult
                });
            }
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
            return res.redirect("/employee/add-employee");
        }
    },
    checkUploadPath: async (req, res, next) => {
        let empPath = "";
        const id = req.params.id;
        try {
            if (req.url.includes("/remove/")) {
                const result = await getEmployeeRemoveModule(id);
                empPath = path.join(__dirname, "../../public/employees/resignations/" + result[0].id.toString() + "-" + result[0].first_name.toLocaleLowerCase() + "-" + result[0].last_name.toLocaleLowerCase() + "-" + result[0].father_name.toLocaleLowerCase());
            } else if (req.url.includes("/emp-files/")) {
                const result = await getEmployeeRemoveModule(id);
                empPath = path.join(__dirname, "../../public/employees/recruitment/" + result[0].id.toString() + "-" + result[0].first_name.toLocaleLowerCase() + "-" + result[0].last_name.toLocaleLowerCase() + "-" + result[0].father_name.toLocaleLowerCase());
            }
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "This employee couldn't find please try again or contact System Admin");
            return res.redirect("/employee");
        }
        await fs.access(empPath, fs.constants.F_OK, err => {
           if (err) {
               // req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
               // return res.redirect("/employee");
               fs.mkdir(empPath, { recursive: true }, (err) => {
                  if (err) {
                      console.log(err);
                      req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
                      return res.redirect("/employee");
                  }
               });
           }
           next();
        });
    },
    uploadFilePathToDB: async (req, res, next) => {
        let emp_id;
        if(req.params.id) {
            emp_id = req.params.id;
        }
        if(req.fileValidationError) {
            if(req.url.includes("/remove/")) {
                req.flash("error_msg", "Please choose correct file format");
                return res.redirect("/employee")
            } else if (req.url.includes("/emp-files/")) {
                req.flash("error_msg", "Please choose correct file format");
                return res.redirect("/employee/emp-files/" + emp_id);
            }
        }
        if(req.fileUploadError) {
            if(req.url.includes("/remove/")) {
                req.flash("error_msg", "An unknown error has been occurred");
                return res.redirect("/employee")
            } else if (req.url.includes("/emp-files/")) {
                req.flash("error_msg", "An unknown error has been occurred");
                return res.redirect("employee/emp-files/" + emp_id);
            }
        }
        let data = {};
        let salaryData = {};

        checkIfEmpExists(emp_id, (err, empRes) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "An unknown error has been occurred");
                return res.redirect("/employee/emp-files/" + emp_id);
            }
            if(empRes === null) {
                req.flash("error_msg", "This employee does not exists");
                return res.redirect("/employee/emp-files/" + emp_id);
            }
            checkIfEmpFileExists(emp_id, (err, empFileRes) => {
                if(err) {
                    console.log(err);
                    req.flash("error_msg", "An unknown error has been occurred");
                    return res.redirect("/employee/emp-files/" + emp_id);
                }
                if(empFileRes === null) {
                    let files = {};
                    if(req.url.includes("/remove/")) {
                        files.resignations = JSON.stringify(req.files);
                        data.files = JSON.stringify(files);
                    } else if (req.url.includes("/emp-files/")) {
                        const gross = req.body.gross;
                        salaryData.gross = gross;
                        salaryData.emp_id = emp_id;
                        salaryData.user_id = req.user.id;
                        addSalary(salaryData, (err , result) => {
                            if (err) {
                                console.log(err);
                                req.flash('error_msg', 'An unkown error has been occurred');
                                return res.redirect('/employee/emp-files' + emp_id);
                            }
                        });
                        addTimeOffLeftToDB({emp_id, days_count: req.body.timeoff_left}, (err, result) => {
                            if (err) {
                                console.log(err);
                                req.flash("error_msg", "An unkown error has been occurred");
                                return res.redirect("/employee/emp-files/" + emp_id);
                            }
                        })
                        files.recruitment = JSON.stringify(req.files);
                        data.files = JSON.stringify(files);
                    }
                    data.user_id = req.user.id;
                    data.emp_id = emp_id;
                    addFileNames(data, (err, result) => {
                        if(err) {
                            console.log(err);
                            req.flash("error_msg", "An unknown error has been occurred");
                            return res.redirect("/employee/emp-files/" + emp_id);
                        }
                        if(req.url.includes("/remove/")) {
                            next();
                        } else {
                            req.flash("success_msg", "Employee data has been updated successfully");
                            return res.redirect("/employee");
                        }
                    })
                } else {
                    const empData = JSON.parse(empFileRes.dataValues.uploaded_files);
                    if(req.url.includes("/remove/")) {
                        empData.resignations = JSON.stringify(req.files);
                    } else if (req.url.includes("/emp-files/")) {
                        empData.recruitment = JSON.stringify(req.files);
                        const gross = req.body.gross;
                        const unofficialPay = req.body.u_pay;
                        if (parseInt(unofficialPay) < 1) {
                            unofficialPay = null
                        }
                        salaryData.gross = gross;
                        salaryData.unofficial_pay = unofficialPay;
                        salaryData.emp_id = emp_id;
                        salaryData.user_id = req.user.id;
                        addSalary(salaryData, (err , result) => {
                            if (err) {
                                console.log(err);
                                req.flash('error_msg', 'An unkown error has been occurred');
                                return res.redirect('/employee/emp-files' + emp_id);
                            }
                        });
                    }
                    data.user_id = req.user.id;
                    data.emp_id = emp_id;
                    data.files = JSON.stringify(empData);
                    updateFileNames(data, (err, result) => {
                        if(err) {
                            if(req.url.includes("/emp-files/")) {
                                req.flash("error_msg", "An unknown error has been occurred");
                                return res.redirect("/employee/emp-files/" + emp_id);
                            } else {
                                req.flash("error_msg", "An unknown error has been occurred");
                                return res.redirect("/employee")
                            }
                        }
                        if(req.url.includes("/emp-files/")) {
                            req.flash("success_msg", "Employee has been updated");
                            return res.redirect("/employee/emp-files/" + emp_id);
                        } else {
                            next();
                        }
                    });
                }
            });
        });
    },
    renderEmpDirAddPage: (req, res) => {
        const empId = req.params.id;
        checkIfEmpExists(empId, (err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "An unknown error has been occurred");
                return res.redirect("/employee");
            }
            const name = `${result.dataValues.first_name} ${result.dataValues.last_name} ${result.dataValues.father_name}`;
            return res.render("employee/employee-data", {
                name
            });
        });
    },
    renderDeletedEmployees: (req, res) => {
        try {
            if (req.user.role === 1) {
                return res.render('employee/deleted-employees', {
                    super_admin: true
                });
            } else if (req.user.role === 2) {
                return res.render('employee/deleted-employees', {
                    admin: true
                });
            } else if (req.user.role === 5) {
                return res.render('employee/deleted-employees', {
                    hr: true
                });
            }else if (req.user.role === 7) {
                return res.render('employee/deleted-employees', {
                    audit: true
                });
            } else if (req.user.role === 10) {
                return res.render('employee/deleted-employees', {
                    deptDirector: true
                });
            }
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "Error occurred while rendering page. Please contact system admin");
            return res.redirect('/dashboard');
        }
    },
    renderSingleEmployeePage: (req, res) => {
        try {
            if (req.user.role === 1) {
                return res.render("employee/employee-single", {
                    super_admin: true
                });
            } else if (req.user.role === 5) {
                return res.render("employee/employee-single", {
                    hr: true
                });
            }
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "Ups... Something went wrong1");
            if (req.user.role === 1) {
                return res.render("employee/employee-single", {
                    super_admin: true
                });
            } else if (req.user.role === 5) {
                return res.render("employee/employee-single", {
                    hr: true
                });
            }
        }
    },
    renderEditedEmployeePage: (req, res) => {
        return res.render("employee/edited-employee");
    }
}