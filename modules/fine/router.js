const { calculateFine, renderFinePage, renderCumilativeFPrints} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, checkRoles } = require("../auth/auth")

router.get("/", renderFinePage);
router.get("/fine-calculation", calculateFine);
router.get('/cumilative/:id', hr, checkRoles, renderCumilativeFPrints);

module.exports = router;