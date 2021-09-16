const { calculate } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth");

router.get("/", hr, calculate);

module.exports = router;