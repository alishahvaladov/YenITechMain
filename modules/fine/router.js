const { calculateFine, renderFinePage, renderCumilativeFPrints} = require("./controller");
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, checkGroupAndRoles } = require("../auth/auth")

router.get("/", ensureAuthenticated, checkGroupAndRoles("Fine_read", true), renderFinePage);
router.get("/fine-calculation", calculateFine);
router.get('/cumilative/:id', ensureAuthenticated, checkGroupAndRoles("Fine_read", true), renderCumilativeFPrints);
router.get('/forgiven-fine', ensureAuthenticated, checkGroupAndRoles("Fine_read", true), (req, res) => {
    res.render('fine/forgiven-fine');
});

module.exports = router;