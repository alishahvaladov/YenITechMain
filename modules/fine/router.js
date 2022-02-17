const { calculateFine, renderFinePage} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth")

router.get("/", renderFinePage);
router.get("/fine-calculation", calculateFine);

module.exports = router;