const express = require("express");
const { addGroup, getDepartmentsForGroups, getGroups } = require("./controller");
const { hr, checkRolesForAPI } = require("../../modules/auth/auth");

const router = express.Router();

router.get("/", hr, checkRolesForAPI, getGroups);
router.post("/add", hr, checkRolesForAPI, addGroup);
router.get("/departments", hr, checkRolesForAPI, getDepartmentsForGroups);


module.exports = router;