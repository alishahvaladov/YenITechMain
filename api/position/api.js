const express = require("express");
const router = express.Router();
const { addPosition, getDepartmentsForPoisiton, getPositionsByDepartment } = require("./controller");
const { admin, checkRoles } = require("../../modules/auth/auth");

router.get('/', admin, checkRoles, getDepartmentsForPoisiton);
router.post('/add-position', admin, checkRoles, addPosition);
router.get('/by-department/:id', admin, checkRoles, getPositionsByDepartment);


module.exports = router;