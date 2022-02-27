const { addTimeOff, renderTimeOffPage, getTimeOff, addTimeOffNonUser, getTimeOffNonUser } = require("./timeoff.controller");
const express = require("express");
const {ensureAuthenticated, hr} = require("../auth/auth");
const router = express.Router();


router.get("/requests", ensureAuthenticated, (req, res) => {
    if (req.user.role === 1 ) {
        res.render("time-off-request/time-off-request", {
            super_admin: true
        });
    } else if (req.user.role === 5) {
        res.render("time-off-request/time-off-request", {
            hr: true
        });
    }
});

router.get("/approve-requests/hr", hr, (req, res) => {
    if(req.user.role === 1) {
        res.render("time-off-request/approve-or-disapprove", {
            super_admin: true
        });
    } else if (req.user.role === 5) {
        res.render("time-off-request/approve-or-disapprove", {
            hr: true
        });
    }
})


router.get("/add-toff-non-user", hr, getTimeOffNonUser);
router.post("/add-toff-non-user", hr, addTimeOffNonUser);

router.post("/requests", ensureAuthenticated, addTimeOff);
router.get("/request/:id", hr, getTimeOff);
router.get("/", hr, renderTimeOffPage);
module.exports = router;