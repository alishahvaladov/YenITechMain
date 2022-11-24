const express = require("express");
const {
  addNewGroupAndAddRights,
  addRightsToGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  deleteRoleForGroup,
  getAllRights
} = require("./controller");
const router = express.Router();

router.post("/add", addNewGroupAndAddRights);
router.post("/addRole", addRightsToGroup);
router.get("/findById/:id", getGroupById);
router.get("/all", getAllGroups);
router.post("/update", updateGroup);
router.post("/delete/:id", deleteGroup);
router.post("/deleteRole", deleteRoleForGroup);
router.get("/getRights", getAllRights);

module.exports = router;
