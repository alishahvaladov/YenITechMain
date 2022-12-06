const { addTimeOff, renderTimeOffPage, getTimeOff, addTimeOffNonUser, getTimeOffNonUser, renderApproveTimeOffHR, renderApproveTimeOffDR } = require("./timeoff.controller");
const express = require("express");
const {ensureAuthenticated, checkGroupAndRoles} = require("../auth/auth");
const router = express.Router();


router.get("/requests", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_read", true), (req, res) => {
    res.render("time-off-request/time-off-request")
});

router.get("/approve-requests/hr", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_update", true), (req, res) => {
    return res.render("time-off-request/approve-or-disapprove");
});
router.get("/approve-requests/dr", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_update", true), (req, res) => {
    return res.render("time-off-request/approve-or-disapprove");
});

router.get("/approve-requests/hr/:id", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_update", true), renderApproveTimeOffHR);
router.get("/approve-requests/dr/:id", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_update", true), renderApproveTimeOffDR);

router.get("/add-toff-non-user", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_create", true), getTimeOffNonUser);
router.post("/add-toff-non-user", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_create", true), addTimeOffNonUser);

router.post("/requests", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_create", true), addTimeOff);
router.get("/request/:id", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_read", true), getTimeOff);
router.get("/", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_read", true), renderTimeOffPage);
router.get("/for-director", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_read", true), renderTimeOffPage);
module.exports = router;