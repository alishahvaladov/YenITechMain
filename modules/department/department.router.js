const { renderDepartment, renderAddDepartment, renderUpdateDepartment, deleteDepartment } = require("./department.controller");
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, checkGroupAndRoles } = require("../auth/auth");


router.get("/add-department", ensureAuthenticated, checkGroupAndRoles("Department_create", true), renderAddDepartment);

router.get("/delete/:id", ensureAuthenticated, checkGroupAndRoles("Department_delete", true), deleteDepartment);

router.get("/", ensureAuthenticated, checkGroupAndRoles("Department_read", true), renderDepartment);

router.get("/update/:id", ensureAuthenticated, checkGroupAndRoles("Department_read", true), renderUpdateDepartment);

module.exports = router;