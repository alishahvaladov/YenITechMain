const { addPosition, getPositions, deletePosition, getPosition, updatePosition } = require("./position.controller");
const express = require("express");
const router = express.Router();
const { super_admin } = require("../auth/auth");

router.get("/add-position", super_admin, (req, res) => {
    return res.render("position/add-position");
});

router.get("/", super_admin, getPositions);
router.get("/delete/:id", super_admin, deletePosition);
router.get('/update/:id', super_admin, getPosition);

router.post("/add-position", super_admin, addPosition);
router.post('/update/:id', super_admin, updatePosition);

module.exports = router;