const { calculateFine, renderFinePage, renderCumilativeFPrints} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, admin, checkRoles, audit } = require("../auth/auth")

router.get("/", hr, admin, checkRoles, renderFinePage);
router.get("/fine-calculation", calculateFine);
router.get('/cumilative/:id', hr, checkRoles, renderCumilativeFPrints);
router.get('/forgiven-fine', audit, checkRoles, (req, res) => {
    res.render('fine/forgiven-fine', {
        audit: true
    });
});

module.exports = router;