const { calculateFine } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth")

router.get("/", calculateFine);

module.exports = router;

