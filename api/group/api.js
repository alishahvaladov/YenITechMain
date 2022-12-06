const express = require("express");
const { addGroup, getDepartmentsForGroups, getGroups, getAllGroupsByDepartment, getGroupsForEdit, insertDeptGroupRel, deleteDeptGroupRel, updateGroupName } = require("./controller");
const { ensureAuthenticated, checkGroupAndRoles } = require("../../modules/auth/auth");

const router = express.Router();

router.get("/", ensureAuthenticated, checkGroupAndRoles("Group_read"), getGroups);
router.post("/add", ensureAuthenticated, checkGroupAndRoles("Group_create"), addGroup);
router.get("/departments", ensureAuthenticated, checkGroupAndRoles("Group_read"), getDepartmentsForGroups);
router.get("/all/:department_id", ensureAuthenticated, checkGroupAndRoles("Group_read"), getAllGroupsByDepartment);
router.get("/edit", ensureAuthenticated, checkGroupAndRoles("Group_read"), getGroupsForEdit);
router.post("/addDepartmentToGroup", ensureAuthenticated, checkGroupAndRoles("Group_update"), insertDeptGroupRel);
router.post("/deleteDepartmentFromGroup", ensureAuthenticated, checkGroupAndRoles("Group_update"), deleteDeptGroupRel);
router.post("/update/name", ensureAuthenticated, checkGroupAndRoles("Group_update"), updateGroupName);

module.exports = router;