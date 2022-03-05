const { addFPrint, getNoFPrints, update, renderAdd} = require("./nofprint.controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth");

router.get("/add-nofprint", hr, renderAdd);

router.post("/add-nofprint", hr, addFPrint);

router.get("/", hr, getNoFPrints);
router.post("/update", hr, update);

module.exports = router; 