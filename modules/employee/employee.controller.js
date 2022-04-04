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
const { addSalary } = require('../salary/salary.service');
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

module.exports = {
    addEmployee: async (req, res) => {
        errors = [];
        const data = req.body;
        data.user_id = req.user.id;
        let fName, lName, fatherName, j_start_date;
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

        const midName = data.middle_name.split('');
        if (data.father_name === '') {
            fatherName = false;
        } else {
            fatherName = data.father_name.split('');
        }
        const tabelNo = data.tabel_no;
        const dob = data.dob;
        const SSN = data.SSN;
        const FIN = data.FIN;
        const prefix = data.prefix;
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

        let logixData = {};

        if(fName) {
            for (let i = 0; i < fName.length; i++) {
                if(!isNaN(parseInt(fName[i]))) {
                    console.log("First name cannot contain number");
                    req.flash("error_msg", "First name cannot contain number")
                    return res.redirect("/employee/add-employee");
                }

                if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(fName[i]) === false) {
                    console.log("First name cannot contain symbol");
                    req.flash("error_msg", "First name cannot contain symbol")
                    return res.redirect("/employee/add-employee");
                }
            }
        } else {
            console.log("Please enter Employee's First Name");
            req.flash("error_msg", "Please enter Employee's First Name");
            return res.redirect("/employee/add-employee");
        }

        if(lName) {
            for (let i = 0; i < lName.length; i++) {
                if(!isNaN(parseInt(lName[i]))) {
                    console.log("Last name cannot contain number");
                    req.flash("error_msg", "Last name cannot contain number")
                    return res.redirect("/employee/add-employee");
                    break;
                }
                if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(lName[i]) === false) {
                    console.log("Last name cannot contain symbol");
                    req.flash("error_msg", "Last name cannot contain symbol")
                    return res.redirect("/employee/add-employee");
                }
            }
        } else {
            console.log("Please enter Employee's Last Name");
            req.flash("error_msg", "Please enter Employee's Last Name");
            return res.redirect("/employee/add-employee");
        }
        if(fatherName) {
            for (let i = 0; i < fatherName.length; i++) {
                if(!isNaN(parseInt(fatherName[i]))) {
                    console.log("Father name cannot contain number");
                    req.flash("error_msg", "Father name cannot contain number")
                    return res.redirect("/employee/add-employee");
                }
                if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(fatherName[i]) === false) {
                    console.log("Father name cannot contain symbol");
                    req.flash("error_msg", "Father name cannot contain symbol")
                    return res.redirect("/employee/add-employee");
                }
            }

        } else {
            console.log("Please enter Employee's Father Name");
            req.flash("error_msg", "Please enter Employee's Father Name");
            return res.redirect("/employee/add-employee");
        }

        for (let i = 0; i < midName.length; i++) {
            if(!isNaN(parseInt(midName[i]))) {
                console.log("Middle name cannot contain number");
                req.flash("error_msg", "Middle name cannot contain number")
                return res.redirect("/employee/add-employee");
            }
            if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(midName[i]) === false) {
                console.log("Middle name cannot contain symbol");
                req.flash("error_msg", "Middle name cannot contain symbol")
                return res.redirect("/employee/add-employee");
            }
        }

        if(sex == 0 || sex == 1) {
            console.log("Gender verified");
        } else {
            console.log("Html interruption for sex: " + sex + "UserID" + req.user.id);
            req.flash("error_msg", "Please enter valid gender");
            return res.redirect("/employee/add-employee");
        }

        if (dob) {
            const sDOB = dob.split("-");
            if(isNaN(parseInt(sDOB[0])) === true || isNaN(parseInt(sDOB[1])) === true || isNaN(parseInt(sDOB[2])) === true) {
                req.flash("error_msg", "Please enter valid date for date of birth");
                return res.redirect("/employee/add-employee");
            }
            if(parseInt(sDOB[0]) > date.getFullYear() - 16) {
                req.flash("error_msg", "This person's age is not enough to work. Please contact with Audit department to approve this person");
                return res.redirect("/employee/add-employee");
            }
        }

        const seperatedSSN = SSN.split('');
        if(seperatedSSN.length !== 13) {
            console.log("SSN must be 13 numbers");
            req.flash("error_msg", "SSN must be 13 numbers")
            return res.redirect("/employee/add-employee");
        }
        for (let i = 0; i < seperatedSSN.length; i++) {
            if((/[0-9]/).test(seperatedSSN[i]) === false) {
                console.log("SSN cannot contain letter or symbol");
                req.flash("error_msg", "SSN cannot contain letter or symbol")
                return res.redirect("/employee/add-employee");
            }
        }

        if(FIN) {
            if(FIN.length !== 7) {
                console.log("FIN must be 7 length long");
                req.flash("error_msg", "FIN must be 7 length long")
                return res.redirect("/employee/add-employee");
            }
            for (let i = 0; i < FIN.length; i++) {
                if((/[a-zA-Z0-9]/).test(FIN[i]) === false) {
                    console.log("FIN cannot contain symbol");
                    req.flash("error_msg", "FIN cannot contain symbol")
                    return res.redirect("/employee/add-employee");
                }
            }
        }

        if(q_address) {
            if(q_address.length < 10) {
                console.log("Q Address must be greater than 10 characters");
                req.flash("error_msg", "Q Address must be greater than 10 characters")
                return res.redirect("/employee/add-employee");
            }
        }

        if(y_address !== null) {
            if(y_address.length < 10) {
                console.log("Y Address must be greater than 10 characters");
                req.flash("error_msg", "Y Address must be greater than 10 characters")
                return res.redirect("/employee/add-employee");
            }
        }


        if(prefix === '050' || prefix === '051' || prefix === '055' || prefix === '099' || prefix === '070' || prefix === '077' || prefix === '060' || prefix === '010') {
            console.log("Prefix validated");
        } else {
            console.log("Please select valid prefix");
            req.flash("error_msg", "Please select valid prefix");
            return res.redirect("/employee/add-employee");
        }

        if(phoneNumber.length !== 7) {
            console.log("Phone number should be 7 characters!");
            req.flash("error_msg", "Phone number should be 7 characters!");
            return res.redirect("/employee/add-employee");
        }

        const seperatedP = phoneNumber.replace(" ", "").split("");

        for (let i = 0; i < seperatedP.length; i++) {
            if(isNaN(parseInt(seperatedP[i]))) {
                console.log("Phone number should be only numbers!");
                req.flash("error_msg", "Phone number should be only numbers!");
                return res.redirect("/employee/add-employee");
            }
        }

        data.phone_number = prefix.toString() + phoneNumber.toString();

        let seperatedH;

        if (homeNumber !== '' && homeNumber !== null) {
            seperatedH = homeNumber.replace(" ", "").split("");
        }

        if (homeNumber === '' || homeNumber === null) {
            homeNumber = null;
        } else if(homeNumber.length !== 7) {
            console.log("Home number should be 7 characters!");
            for (let i = 0; i < seperatedH.length; i++) {
                if(isNaN(parseInt(seperatedH[i]))) {
                    console.log("Home number should be only numbers!");
                    req.flash("error_msg", "Home number should be only numbers!");
                    return res.redirect("/employee/add-employee");
                }
            }
            req.flash("error_msg", "Home number should be 7 characters!");
            return res.redirect("/employee/add-employee");
        }

        if(parseInt(selectedShiftType) === 1) {
            if(parseInt(shiftType) === 1 || parseInt(shiftType) === 2 || parseInt(shiftType) === 3) {
                if(parseInt(shiftType) === 1) {
                    data.shift_start_t = '10:00';
                    data.shift_end_t = '19:00';
                } else if (parseInt(shiftType) === 2) {
                    data.shift_start_t = '10:00';
                    data.shift_end_t = '14:00';
                } else if (parseInt(shiftType) === 3) {
                    data.shift_start_t = '14:00';
                    data.shift_end_t = '19:00';
                }
            } else {
                req.flash("Wrong shift type selected please try again");
                return res.redirect("/employee/add-employee");
            }
        } else if(parseInt(selectedShiftType) === 2) {
            const splittedShiftStart = data.shift_start_t.split(":");
            const splittedShiftEnd = data.shift_end_t.split(":");
            if (parseInt(splittedShiftStart[0]) - parseInt(splittedShiftEnd[0]) > 0) {
                req.flash("error_msg", "Please choose valid shift times");
                return res.redirect("/employee/add-employee");
            }
            const shiftStartT = data.shift_start_t;
            const shiftEndT = data.shift_end_t;
            if(shiftStartT === "" || shiftStartT === null || shiftEndT === "" || shiftEndT === null) {
                req.flash("error_msg", "Please fill shift times");
                return res.redirect('/employee/add-employee');
            }
        } else {
            req.flash("error_msg", "Please choose shift type");
            return res.redirect('/employee/add-employee');
        }
        if(j_start_date) {
            if(parseInt(j_start_date[0]) <= year && parseInt(j_start_date[1]) < month) {
                console.log("Maximum range for Job Start Date is 1 month");
                req.flash("error_msg", "Maximum range for Job Start Date is 1 month");
                return res.redirect("/employee/add-employee");
            }
            if (parseInt(j_start_date[0]) >= year && parseInt(j_start_date[1]) >= month + 1 && parseInt(j_start_date[2]) > day) {
                console.log("You cannot add employee (a day/days) after from today!");
                req.flash("error_msg", "You cannot add employee (a day/days) after from today!");
                return res.redirect("/employee/add-employee");
            }
        } else {
            console.log("Please enter Job Start Date!");
            req.flash("error_msg", "Please enter Job Start Date!");
            return res.redirect("/employee/add-employee");
        }

        if(isNaN(parseInt(dayOffDays))) {
            console.log("Please enter valid day off dates");
            req.flash("error_msg", "Please enter valid day off dates");
            return res.redirect("/employee/add-employee");
        }

        if(fDay === 'on') {
            data.working_days = 77;
        } else if (parseInt(wDays) > 26) {
            req.flash("Working days cannot be greater than maximum working day limit");
            return res.redirect("/employee/add-employee");
        } else if(isNaN(parseInt(wDays))) {
            req.flash("Please enter valid working days");
            res.redirect("/employee/add-employee");
        }

        if(isNaN(parseInt(department))) {
            console.log("Please enter valid department");
            req.flash("error_msg", "Please enter valid department");
            return res.redirect("/employee/add-employee");
        }

        if(isNaN(parseInt(position))) {
            console.log("Please enter valid position");
            req.flash("error_msg", "Please enter valid position");
            return res.redirect("/employee/add-employee");
        }

        if(isNaN(parseInt(project))) {
            console.log("Please enter valid project");
            req.flash("error_msg", "Please enter valid project");
            return res.redirect("/employee/add-employee");
        }

        if(tabelNo === "" || tabelNo === null) {
            req.flash("error_msg", "Please enter tabel no");
            return res.redirect("/employee/add-employee");
        } else {
            let checkTabel = await checkIfTabelNoExists(data.tabel_no);
            console.log(checkTabel.length);
            if (checkTabel.length > 0) {
                req.flash("error_msg", "This tabel no already in use. Please write another one");
                return res.redirect("/employee/add-employee");
            } 
        }

        Employee.findOne({
            where: {
                SSN: data.SSN
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
                FIN: data.FIN
            },
            logging: false
        }).then((employee) => {
            if(employee) {
                console.log("This FIN already exists please check again");
                req.flash("error_msg", "This FIN already exists please check again");
                return res.redirect("/employee/add-employee");
            }
            if (errors.length === 0) {
                addEmployee(data, (err, results) => {
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
                        console.log(result);
                        req.flash("success_msg", "Employee has been added please fill employee data to continue");
                        return res.redirect("/employee/emp-files/" + empId);
                    });
                }); 
            }
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
            if(req.user.role === 5 ) {
                res.render("employee/employee", {
                    employee: result,
                    hr: true,
                    hr_emp: true
                });
            } else if (req.user.role === 1) {
                res.render("employee/employee", {
                    employee: result,
                    super_admin: true,
                    super_admin_emp: true
                });
            }
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "An unknown error occurred please contact System Admin")
            res.redirect("/employee");
        }
    },
    updateEmployee: (req, res) => {
        errors = [];
        const data = req.body;
        const fName = data.first_name;
        const lName = data.last_name;
        const fatherName = data.father_name;
        const dob = data.dob;
        const SSN = data.SSN;
        const phoneNumber = data.phone_number;
        const homeNumber = data.home_number;
        const dayOffDays = data.dayoff_days_total;
        const department = data.department;
        const position = data.position_id;
        const project = data.project_id;
        const sex = data.sex;
        const date = new Date();
        const id = req.params.id;

        fName.split('').forEach(item => {
            if(!isNaN(parseInt(item))) {
                console.log("First name cannot contain number");
                errors.push({msg: "First name cannot contain number"});
            }
        });
        lName.split('').forEach(item => {
            if(!isNaN(parseInt(item))) {
                console.log("First name cannot contain number");
                errors.push({msg: "First name cannot contain number"});
            }
        });
        fatherName.split('').forEach(item => {
            if(!isNaN(parseInt(item))) {
                console.log("First name cannot contain number");
                errors.push({msg: "First name cannot contain number"});
            }
        });

        if (dob) {
            const sDOB = dob.split("-");
            if(isNaN(parseInt(sDOB[0])) === true || isNaN(parseInt(sDOB[1])) === true || isNaN(parseInt(sDOB[1])) === true) {
                errors.push("Please enter valid date for date of birth");
            }
            if(parseInt(sDOB[2]) > date.getFullYear() - 18) {
                errors.push("This person's age is not enough to work. Please contact with Audit department to approve this person")
            }
        }


        if(sex !== 0 || sex !== 1) {
            console.log("Gender has changed manually from html codes: " + sex + req.user.id);
            errors.push({msg: "Please choose valid gender from list"});
        }

        const seperatedSSN = SSN.split('');

        for (let i = 0; i < seperatedSSN; i++) {
            if(!isNaN(parseInt(seperatedSSN[i]))) {
                console.log("SSN should be only numbers!");
                errors.push({msg: "SSN should be only numbers!"});
                break;
            }
        }

        const seperatedP = phoneNumber.replace(" ", "").split("");

        for (let i = 0; i < seperatedP.length; i++) {
            if(isNaN(parseInt(seperatedP[i]))) {
                console.log("Phone number should be only numbers!");
                errors.push({msg: "Phone number should be only numbers!"});
                break;
            }
        }

        const seperatedH = homeNumber.replace(" ", "").split("");

        for (let i = 0; i < seperatedH.length; i++) {
            if(isNaN(parseInt(seperatedH[i]))) {
                console.log("Home number should be only numbers!");
                errors.push({msg: "Home number should be only numbers!"});
                break;
            }
        }

        if(isNaN(parseInt(dayOffDays))) {
            console.log("Please enter valid dates");
            errors.push("Please enter valid dates");
        }

        if(isNaN(parseInt(department))) {
            console.log("Please enter valid department");
            errors.push("Please enter valid department");
        }

        if(isNaN(parseInt(position))) {
            console.log("Please enter valid position");
            errors.push("Please enter valid position");
        }

        if(isNaN(parseInt(project))) {
            console.log("Please enter valid project");
            errors.push("Please enter valid project");
        }


        Employee.findOne({
            where: {
                SSN: data.SSN,
                id: {
                    [Op.ne]: id
                }
            }
        }).then((employee) => {
            if(employee) {
                errors.push({msg: "This SSN already exists please check again"});
                console.log(employee);
                req.flash("error_msg", "This SSN already exists please check again");
                return res.redirect("/employee/update/" + id);
            }
        });
        console.log("Data: " + data);

        Employee.findOne({
            where: {
                FIN: data.FIN,
                id: {
                    [Op.ne]: id
                }
            }
        }).then((employee) => {
            if(employee) {
                errors.push({msg: "This FIN already exists please check again"});
                console.log(employee);
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
                   console.log(result);
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
                console.log("Errors: " + errors);
                updateEmployee(id, data, (err, results) => {
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
                console.log(deptResult);
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
           console.log(result);
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
        console.log(req.body.u_pay);
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
}