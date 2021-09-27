const { addEmployee, deleteEmployee, getEmployees, updateEmployee, getEmployee, updateJEnd, renderAddEmployeeForDept, renderAddEmployeeForPj, renderAddEmployeeForPos } = require("./employee.service");
const { Employee } = require("../../db_config/models");
const {Op} = require("sequelize");
let errors = [];

module.exports = {
    addEmployee: (req, res) => {
        errors = [];
        const data = req.body;
        data.user_id = req.user.id;
        const fName = data.first_name.split('');
        const lName = data.last_name.split('');
        const fatherName = data.father_name.split('');
        const dob = data.dob;
        const SSN = data.SSN;
        const phoneNumber = data.phone_number;
        const homeNumber = data.home_number;
        const shiftStart = data.shift_start_t;
        const shiftEnd = data.shift_end_t;
        const dayOffDays = data.dayoff_days_total;
        const department = data.department;
        const position = data.position_id;
        const project = data.project_id;
        const date = new Date();
        const sex = data.sex;

        console.log("Type of Time: " + typeof data.shift_start_t);
        console.log("Type of Date: " + typeof data.dob);

        console.log(typeof fName + ' ' + lName + ' ' + fatherName);

        for (let i = 0; i < fName.length; i++) {
            console.log(fName[i]);
            if(!isNaN(parseInt(fName[i]))) {
                console.log("First name cannot contain number");
                errors.push({msg: "First name cannot contain number"});
                break;
            }
        }

        for (let i = 0; i < lName.length; i++) {
            if(!isNaN(parseInt(lName[i]))) {
                console.log("Last name cannot contain number");
                errors.push({msg: "Last name cannot contain number"});
                break;
            }
        }
        for (let i = 0; i < fatherName.length; i++) {
            if(!isNaN(parseInt(fatherName[i]))) {
                console.log("Father name cannot contain number");
                errors.push({msg: "Father name cannot contain number"});
                break;
            }
        }

        if(sex == 0 || sex == 1) {
            console.log("Sex GG");
        } else {
            console.log("Html interruption for sex: " + sex + "UserID" + req.user.id);
            errors.push({msg: "Please enter valid gender"});
        }

        if (dob) {
            const sDOB = dob.split("-");
            if(isNaN(parseInt(sDOB[0])) === true || isNaN(parseInt(sDOB[1])) === true || isNaN(parseInt(sDOB[2])) === true) {
                errors.push({msg: "Please enter valid date for date of birth"});
            }
            if(parseInt(sDOB[0]) > date.getFullYear() - 16) {
                errors.push({msg: "This person's age is not enough to work. Please contact with Audit department to approve this person"});
            }
        }

        if (shiftStart && shiftEnd) {
            let sShiftStart = shiftStart.split(":");
            if(isNaN(parseInt(sShiftStart[0])) === true || isNaN(parseInt(sShiftStart[1])) === true) {
                console.log("Please enter valid time for Shift Start");
                errors.push({msg: "Please enter valid time for Shift Start"});
            }
            let sShiftEnd = shiftEnd.split(":");
            if(isNaN(parseInt(sShiftEnd[0])) === true || isNaN(parseInt(sShiftEnd[1])) === true) {
                console.log("Please enter valid time for Shift End");
                errors.push({msg: "Please enter valid time for Shift End"});
            }

            let sSHour = sShiftStart[0];
            let sEHour = sShiftEnd[0];

            if(parseInt(sEHour) - parseInt(sSHour) < 4) {
                console.log("User: " + req.user.id + "Difference is: " + (parseInt(sEHour) - parseInt(sSHour)));
                errors.push({msg: "The minimum work hour is 4 please check and try again"});
            }
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
            errors.push({msg: "Please enter valid dates"});
        }

        if(isNaN(parseInt(department))) {
            console.log("Please enter valid department");
            errors.push({msg: "Please enter valid department"});
        }

        if(isNaN(parseInt(position))) {
            console.log("Please enter valid position");
            errors.push({msg: "Please enter valid position"});
        }

        if(isNaN(parseInt(project))) {
            console.log("Please enter valid project");
            errors.push({msg: "Please enter valid project"});
        }

        if(errors.length !== 0) {
            console.log(errors);
            if(req.user.role === 5) {
                return res.render("employee/add-employee", {
                    errors,
                    hr: true
                });
            } else if (req.user.role === 1) {
                return res.render("employee/add-employee", {
                    errors,
                    super_admin: true
                });
            }
        }

        Employee.findOne({
            where: {
                SSN: data.SSN
            }
        }).then((employee) => {
            if(employee) {
                errors.push({msg: "This SSN already exists please check again"});
                console.log("This SSN already exists please check again");
                if(req.user.role === 5) {
                    return res.render("employee/add-employee", {
                        errors,
                        hr: true
                    });
                } else if (req.user.role === 1) {
                    return res.render("employee/add-employee", {
                        errors,
                        super_admin: true
                    });
                }
            }
        });
        Employee.findOne({
            where: {
                FIN: data.FIN
            }
        }).then((employee) => {
            if(employee) {
                errors.push({msg: "This FIN already exists please check again"});
                console.log("This FIN already exists please check again");
                if(req.user.role === 5) {
                    return res.render("employee/add-employee", {
                        errors,
                        hr: true
                    });
                } else if (req.user.role === 1) {
                    return res.render("employee/add-employee", {
                        errors,
                        super_admin: true
                    });
                }
            }
            console.log(errors);
            if (errors.length === 0) {
                console.log("Errors: " + errors);
                addEmployee(data, (err, results) => {
                    if(err) {
                        console.log("Error" + err.message);
                        return res.status(500).json({
                            success: 0,
                            message: "Check Error then try again",
                            error: err.message
                        });
                    }
                    console.log(results);
                    req.flash("success_msg", "An employee has been added successfully");
                    return  res.redirect("/salaries/salary/" + results.dataValues.id);
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
                    hr: true
                });
            } else if (req.user.role === 1) {
                res.render("employee/employee", {
                    employee: result,
                    super_admin: true
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
        const shiftStart = data.shift_start_t;
        const shiftEnd = data.shift_end_t;
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

        if(shiftStart) {
            let sShiftStart = shiftStart.split(":");
            if(isNaN(parseInt(sShiftStart[0])) === true || isNaN(parseInt(sShiftStart[1])) === true) {
                console.log("Please enter valid time for Shift Start");
                errors.push("Please enter valid time for Shift Start");
            }
        }

        if(shiftEnd) {
            let sShiftEnd = shiftEnd.split(":");
            if(isNaN(parseInt(sShiftEnd[0])) === true || isNaN(parseInt(sShiftEnd[1])) === true) {
                console.log("Please enter valid time for Shift End");
                errors.push("Please enter valid time for Shift End");
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
        const id = req.body.id;

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
            req.flash("error_msg", "An unkown error has been occurred please contact System Admin");
            return res.redirect("/employee/add-employee");
        }
    }
}