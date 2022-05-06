const { addTimeOff, renderTimeOffPage, getTimeOff, addTimeOffNonUser, getTimeOffNonUser, renderApproveTimeOffHR, renderApproveTimeOffDR } = require("./timeoff.controller");
const express = require("express");
const {ensureAuthenticated, hr, deptDirector, checkRoles} = require("../auth/auth");
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
});
router.get("/approve-requests/dr", deptDirector, (req, res) => {
    if(req.user.role === 1) {
        res.render("time-off-request/approve-or-disapprove", {
            super_admin: true
        });
    } else if (req.user.role === 5) {
        res.render("time-off-request/approve-or-disapprove", {
            hr: true
        });
    } else if (req.user.role === 10) {
        res.render("time-off-request/approve-or-disapprove", {
            deptDirector: true
        });
    }
});

router.get("/approve-requests/hr/:id", hr, renderApproveTimeOffHR);
router.get("/approve-requests/dr/:id", deptDirector, renderApproveTimeOffDR);

router.get("/add-toff-non-user", hr, getTimeOffNonUser);
router.post("/add-toff-non-user", hr, addTimeOffNonUser);

router.post("/requests", ensureAuthenticated, addTimeOff);
router.get("/request/:id", hr, getTimeOff);
router.get("/", hr, checkRoles, renderTimeOffPage);
router.get("/for-director", deptDirector, checkRoles, renderTimeOffPage);
module.exports = router;