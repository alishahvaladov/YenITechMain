const express =require("express");
const { getNavbars, getGroupsForNav, addNavbarAGroupRel, removeNavbarAGroupRel } = require("./controller");
const { admin, checkRoles } = require("../../modules/auth/auth");
const router = express.Router();

router.get("/", admin, checkRoles, getNavbars);
router.get("/groups", admin, checkRoles, getGroupsForNav);
router.post("/add", admin, checkRoles, addNavbarAGroupRel);
router.post("/remove", admin, checkRoles, removeNavbarAGroupRel);

module.exports = router;