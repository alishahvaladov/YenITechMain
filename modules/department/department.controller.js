const { addDepartment, deleteDepartment, getDepartments, updateDepartment, getDepartment } = require("./department.service");
const { Department } = require("../../db_config/models");
let errors = [];

module.exports = {
    renderDepartment: (req, res) => {
        return res.render("department/department");
    },
    renderAddDepartment: (req, res) => {
        return res.render("department/add-department");
    },
    renderUpdateDepartment: (req, res) => {
        return res.render("department/update-department");
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
}