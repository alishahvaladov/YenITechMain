const { searchFPrint } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../../modules/auth/auth");

router.post("/search", hr, searchFPrint);

module.exports = router;