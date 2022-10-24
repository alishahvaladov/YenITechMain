const { addProject, getProjects, getProject, updateProject, deleteProject, getChildren } = require("./project.service");
const { Project } = require("../../db_config/models");
const {response} = require("express");
const {Op} = require("sequelize");
let errors = [];

module.exports = {
    addProject: (req, res) => {
        errors = [];
        const data = req.body;
        data.user_id = req.user.id;
        if(!data.parent_id || data.parent_id === "") {
            data.parent_id = null;
        }
        Project.findOne({
            where: {
                name: data.name
            }
        }).then((project) => {
            if(project) {
                errors.push({msg: "This project already exists"});
                return res.render("project/add-project", {
                    errors
                });
            }
            if(errors.length === 0) {
                addProject(data, (err, result) => {
                    if(err) {
                        return console.log(err);
                    }
                    req.flash("success_msg", "A project has been uploaded successfully");
                    return res.redirect("/projects");
                });
            }
        });
    },
    getProjects: (req, res) => {
        getProjects((err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg","An unknown error occurred please contact System Admin");
                return res.redirect("/projects");
            }
            if(req.user.role === 5) {
                res.render('project/projects', {
                    projects: result,
                    hr: true
                });
            } else if (req.user.role === 1) {
                res.render('project/projects', {
                    projects: result,
                    super_admin: true
                });
            }
        })
    },
    getProject: (req, res) => {
        const id = req.params.id;
        getProject(id,(err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "This project doesn't exist please try again");
                return res.redirect("/projects");
            }
            if(req.user.role === 5) {
                return res.render("project/update", {
                    project: result.dataValues,
                    hr: true
                });
            } else if (req.user.role === 1) {
                return res.render("project/update", {
                    project: result.dataValues,
                    super_admin: true
                });
            }
        });
    },
    updateProject: (req, res) => {
        const id = req.params.id;
        const data = req.body;

        if(!data.parent_id) {
            data.parent_id = null;
        }

        Project.findOne({
            where: {
                name: data.name,
                id: {
                    [Op.ne]: id
                }
            }
        }).then((project) => {
            if(project) {
                errors.push({msg: "This project already exists"});
                req.flash("error_msg", "This project already exists");
                return res.redirect("/projects")
            }
            if(errors.length === 0) {
                updateProject(id, data, (err, result) => {
                    if(err) {
                        return console.log(err);
                        req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
                        return res.redirect("/projects/update/" + id);
                    }
                    req.flash("success_msg", "A project has been updated");
                    return res.redirect("/projects");
                });
            }
        }).catch(err => {
            console.log(err);
            req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
            return res.redirect("/projects/update/" + id);
        })
    },
    deleteProject: (req, res) => {
        const id = req.params.id;
        deleteProject(id, (err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "An unknown error occurred please contact System Admin");
                return res.redirect("/projects");
            }
            req.flash("success_msg", "This project has been deleted");
            return res.redirect("/projects");
        })
    },
    getChildren: async (req, res) => {
        try {
            let id = req.params.id;
            let result = await getChildren(id);
            if (req.user.role === 1) {
                res.render("project/children", {
                    super_admin: true,
                    projects: result
                });
            } else if (req.user.role === 5) {
                res.render("project/children", {
                    hr: true,
                    projects: result
                });
            }
        }  catch (err) {
        }
    }
}