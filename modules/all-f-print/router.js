const { getAllFPrints } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth");

router.get("/", hr, getAllFPrints);


module.exports = router;