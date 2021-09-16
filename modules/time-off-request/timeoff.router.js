const { addTimeOff, getTimeOffs, getTimeOff } = require("./timeoff.controller");
const express = require("express");
const {ensureAuthenticated, hr} = require("../auth/auth");
const router = express.Router();


router.get("/requests", ensureAuthenticated, (req, res) => {
    res.render("time-off-request/time-off-request");
})

router.post("/requests", ensureAuthenticated, addTimeOff);

router.get("/request/:id", hr, getTimeOff);

router.get("/", hr, getTimeOffs);


module.exports = router;