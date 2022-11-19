const express = require("express");
const {
  addNewGroup,
  addRightsToGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  deleteRoleForGroup,
} = require("./controller");
const router = express.Router();

router.post("/add", addNewGroup);
router.post("/addRole", addRightsToGroup);
router.get("/findById/:id", getGroupById);
router.get("/all", getAllGroups);
router.post("/update", updateGroup);
router.post("/delete/:id", deleteGroup);
router.post("/deleteRole", deleteRoleForGroup);

module.exports = router;
