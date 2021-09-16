const { addProject, getProjects, getProject, updateProject, deleteProject} = require("./project.controller");
const express = require("express");
const router = express.Router();
const { super_admin } = require("../auth/auth");

router.get("/add-project", super_admin, (req, res) => {
    res.render("project/add-project");
});

router.post("/add-project", super_admin, addProject);

router.get("/", super_admin, getProjects);
router.get('/update/:id', super_admin, getProject);
router.post('/update/:id', super_admin, updateProject);
router.get("/delete/:id", super_admin, deleteProject);
module.exports = router;