const express = require("express");
const router = express.Router();
const { addPosition, getDepartmentsForPoisiton, getPositionsByDepartment, getAllPositions } = require("./controller");
const { admin, hr, checkRoles } = require("../../modules/auth/auth");

router.get('/', admin, checkRoles, getDepartmentsForPoisiton);
router.post('/add-position', admin, checkRoles, addPosition);
router.get('/by-department/:id', admin, hr, checkRoles, getPositionsByDepartment);
router.get('/allPositions/:offset', admin, hr, getAllPositions);


module.exports = router;