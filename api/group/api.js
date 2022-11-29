const express = require("express");
const { addGroup, getDepartmentsForGroups, getGroups, getAllGroupsByDepartment, getGroupsForEdit, insertDeptGroupRel, deleteDeptGroupRel, updateGroupName } = require("./controller");
const { hr, checkRolesForAPI } = require("../../modules/auth/auth");

const router = express.Router();

router.get("/", hr, checkRolesForAPI, getGroups);
router.post("/add", hr, checkRolesForAPI, addGroup);
router.get("/departments", hr, checkRolesForAPI, getDepartmentsForGroups);
router.get("/all/:department_id", hr, checkRolesForAPI, getAllGroupsByDepartment);
router.get("/edit", hr, checkRolesForAPI, getGroupsForEdit);
router.post("/addDepartmentToGroup", hr, checkRolesForAPI, insertDeptGroupRel);
router.post("/deleteDepartmentFromGroup", hr, checkRolesForAPI, deleteDeptGroupRel);
router.post("/update/name", hr, checkRolesForAPI, updateGroupName);


module.exports = router;