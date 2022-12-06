const express =require("express");
const { getNavbars, getGroupsForNav, addNavbarAGroupRel, removeNavbarAGroupRel } = require("./controller");
const { ensureAuthenticated, checkGroupAndRoles } = require("../../modules/auth/auth");
const router = express.Router();

router.get("/", ensureAuthenticated, checkGroupAndRoles("NavbarManagement_read"), getNavbars);
router.get("/groups", ensureAuthenticated, checkGroupAndRoles("NavbarManagement_read"), getGroupsForNav);
router.post("/add", ensureAuthenticated, checkGroupAndRoles("NavbarManagement_update"), addNavbarAGroupRel);
router.post("/remove", ensureAuthenticated, checkGroupAndRoles("NavbarManagement_update"), removeNavbarAGroupRel);

module.exports = router;