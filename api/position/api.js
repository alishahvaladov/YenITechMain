const express = require("express");
const router = express.Router();
const { addPosition, getDepartmentsForPoisiton, getPositionsByDepartment, getAllPositions, getPositionByID, updatePositionName, updateDeptPosRels } = require("./controller");
const { admin, hr, checkRoles } = require("../../modules/auth/auth");

router.get('/', admin, checkRoles, getDepartmentsForPoisiton);
router.post('/add-position', admin, checkRoles, addPosition);
router.get('/by-department/:id', admin, hr, checkRoles, getPositionsByDepartment);
router.get('/allPositions/:offset', admin, hr, checkRoles, getAllPositions);
router.get('/position-by-id/:id', admin, checkRoles, getPositionByID);
router.get('/update/name/:id', admin, checkRoles, updatePositionName);
router.get('/update/department', admin, checkRoles, updateDeptPosRels);


module.exports = router;