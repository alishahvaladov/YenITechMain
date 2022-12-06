const express = require("express");
const {
  addNewGroupAndAddRights,
  addRightsToGroup,
  getAllGroups,
  getGroupAndNavbarById,
  updateGroup,
  deleteGroup,
  deleteRoleForGroup,
  getNavbars,
  getAllRightsAndNavbars,
  addNavbarAGroupRel,
  removeNavbarAGroupRel
} = require("./controller");
const { ensureAuthenticated, checkGroupAndRoles } = require("../../modules/auth/auth");
const router = express.Router();

router.post("/add", ensureAuthenticated, checkGroupAndRoles("AccessGroup_create"), addNewGroupAndAddRights);
router.post("/addRole", ensureAuthenticated, checkGroupAndRoles("AccessGroup_create"), addRightsToGroup);
router.get("/findById/:id", ensureAuthenticated, checkGroupAndRoles("AccessGroup_read"), getGroupAndNavbarById);
router.get("/all", ensureAuthenticated, checkGroupAndRoles("AccessGroup_read"), getAllGroups);
router.post("/update", ensureAuthenticated, checkGroupAndRoles("AccessGroup_update"), updateGroup);
router.post("/delete/:id", ensureAuthenticated, checkGroupAndRoles("AccessGroup_delete"), deleteGroup);
router.post("/deleteRole", ensureAuthenticated, checkGroupAndRoles("AccessGroup_update"), deleteRoleForGroup);
router.get("/getRights", ensureAuthenticated, checkGroupAndRoles("AccessGroup_read"), getAllRightsAndNavbars);

router.post("/menus/add", ensureAuthenticated, checkGroupAndRoles("AccessGroup_update"), addNavbarAGroupRel);
router.post("/menus/remove", ensureAuthenticated, checkGroupAndRoles("AccessGroup_update"), removeNavbarAGroupRel);

module.exports = router;
