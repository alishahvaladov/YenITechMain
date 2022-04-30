const express = require("express");
const router = express.Router();
const { addPosition, getDepartmentsForPoisiton, getPositionsByDepartment } = require("./controller");
const { admin, hr, checkRoles } = require("../../modules/auth/auth");

router.get('/', admin, checkRoles, getDepartmentsForPoisiton);
router.post('/add-position', admin, checkRoles, addPosition);
router.get('/by-department/:id', admin, hr, checkRoles, getPositionsByDepartment);


module.exports = router;