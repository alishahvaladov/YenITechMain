const { addFPrint, getNoFPrints, update, renderAdd} = require("./nofprint.controller");
const express = require("express");
const router = express.Router();
const { hr, checkRoles } = require("../auth/auth");

router.get("/add-nofprint", hr, renderAdd);

router.post("/add-nofprint", hr, checkRoles, addFPrint);

router.get("/", hr, getNoFPrints);
router.post("/update", hr, checkRoles, update);

module.exports = router; 