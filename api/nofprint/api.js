const express = require("express");
const { getNoFPrints } = require("./controller");
const { hr } = require("../../modules/auth/auth");
const router = express.Router();

router.post("/", hr, getNoFPrints);

module.exports = router;