const { addDepartment, deleteDepartment, getDepartments, updateDepartment, getDepartment} = require("./department.controller");
const express = require("express");
const router = express.Router();
const {super_admin, checkRoles} = require("../auth/auth");


router.get("/add-department", super_admin, (req, res) => {
    if (req.user.role === 5) {
        res.render("department/add-department", {
            hr: true
        });
    } else if (req.user.role === 1) {
        res.render("department/add-department", {
            super_admin: true
        });
    }
});
router.post("/add-department", super_admin, addDepartment);

router.get("/delete/:id", super_admin, deleteDepartment);

router.get("/", super_admin, getDepartments);

router.get("/update/:id", super_admin, getDepartment)
router.post("/update/:id", super_admin, updateDepartment);

module.exports = router;