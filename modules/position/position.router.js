const { addPosition, getPositions, deletePosition, getPosition, updatePosition } = require("./position.controller");
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, checkGroupAndRoles } = require("../auth/auth");

router.get("/add-position", ensureAuthenticated, checkGroupAndRoles("Position_create", true), (req, res) => {
    return res.render("position/add-position");
});

router.get("/", ensureAuthenticated, checkGroupAndRoles("Poisition_read", true), getPositions);
router.get("/delete/:id", ensureAuthenticated, checkGroupAndRoles("Position_delete", true), deletePosition);
router.get('/update/:id', ensureAuthenticated, checkGroupAndRoles("Position_update", true), getPosition);

router.post("/add-position", ensureAuthenticated, checkGroupAndRoles("Position_create", true), addPosition);
router.post('/update/:id', ensureAuthenticated, checkGroupAndRoles("Position_update", true), updatePosition);

module.exports = router;