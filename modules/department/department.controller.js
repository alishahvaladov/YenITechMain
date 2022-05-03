const { addDepartment, deleteDepartment, getDepartments, updateDepartment, getDepartment } = require("./department.service");
const { Department } = require("../../db_config/models");
let errors = [];

module.exports = {
    addDepartment: (req, res) => {
        errors = [];
        const data = req.body;
        const splitName = data.name.split("");
        data.user_id = req.user.id;

        for(let i = 0; i < splitName.length; i++) {
            if(!isNaN(parseInt(splitName[i]))) {
                errors.push({msg: "Name cannot contain numbers please"});
                req.flash("error_msg","Name cannot contain numbers please")
                return res.redirect("/department/add-department");
                break;
            }
        }


        try {
            Department.findOne({
                where: {
                    name: data.name,
                }
            }).then((department) => {
                if(department) {
                    req.flash("error_msg", "This department in this project already exist please try again");
                    return res.redirect("/department/add-department");
                } else {
                    addDepartment(data, (err, result) => {
                        if(err) throw err;
                        req.flash("success_msg", "Department has been uploaded successfully")
                        return res.redirect("/department");
                    })
                }
            });
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "Something went wrong!");
            return res.redirect("/department");
        }
    },
    deleteDepartment: (req, res) => {
        const id = req.params.id;

        Department.findOne({
            where: {
                id: id
            }
        }).then((dept) => {
            if(dept) {
                deleteDepartment(id, (err, result) => {
                    if (err) {
                        console.log(err);
                        req.flash("error_msg", "This department doesn't exist")
                        return res.redirect("/department");
                    }
                });
                req.flash("success_msg", "Department has been deleted");
                return res.redirect("/department");
            }
            req.flash("error_msg", "This department doesn't exist");
            return res.redirect("/department");
        }).catch((err) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "This department doesn't exist")
                return res.redirect("/department");
            }
        })
    },
    getDepartments: (req, res) => {
        getDepartments((err, result) => {
            if (err) {
                console.log(err);
                req.flash("error_msg", "An unknown error occurred. Please contact Sys Admin");
                return res.redirect("/department");
            }
            const departments = result;
            if(req.user.role === 5) {
                return res.render("department/department", {
                    departments,
                    hr: true
                });
            } else if (req.user.role === 1) {
                return res.render("department/department", {
                    departments,
                    super_admin: true
                });
            }
        });
    },
    updateDepartment: (req, res) => {
        errors = [];
        const data = req.body;
        const id = req.params.id;
        const splitName = data.name.split("");

        for(let i = 0; i < splitName.length; i++) {
            if(!isNaN(parseInt(splitName[i]))) {
                req.flash("error_msg", "Name cannot contain numbers")
                return res.redirect("/department/update/" + id);
                break;
            }
        }

        updateDepartment(id, data, (err, result) => {
            if (err) {
                console.log(err);
                req.flash("error_msg", "An unknown error occurred. Please contact sysadmin");
                return res.redirect('/department/update/' + id);
            }
            req.flash("success_msg", "Department has been updated");
            return res.redirect("/department/update/" + id);
        });
    },
    getDepartment: (req, res) => {
        const id = req.params.id;
        getDepartment(id, (err, result) => {
            if(err) {
                req.flash("error_msg", "This department couldn't find please try again");
                return res.redirect("/department");
            }
            if (req.user.role === 5) {
                return res.render("department/update-department", {
                    department: result.dataValues,
                    hr: true
                });
            } else if (req.user.role === 1) {
                return res.render("department/update-department", {
                    department: result.dataValues,
                    super_admin: true
                });
            }
        });
    }
}