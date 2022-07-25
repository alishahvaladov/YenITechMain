const express = require("express");
const router = express.Router();
const { addPosition, getDepartmentsForPoisiton, getPositionsByDepartment, getAllPositions, getPositionByID, updatePositionName, updateDeptPosRels, exportDataToExcel } = require("./controller");
const { admin, hr, checkRolesForAPI } = require("../../modules/auth/auth");

router.get('/', admin, checkRolesForAPI, getDepartmentsForPoisiton);
router.post('/add-position', admin, checkRolesForAPI, addPosition);
router.get('/by-department/:id', admin, hr, checkRolesForAPI, getPositionsByDepartment);
router.post('/allPositions/:offset', admin, hr, checkRolesForAPI, getAllPositions);
router.get('/position-by-id/:id', admin, checkRolesForAPI, getPositionByID);
router.get('/update/name/:id', admin, checkRolesForAPI, updatePositionName);
router.get('/update/department', admin, checkRolesForAPI, updateDeptPosRels);
router.post('/export-to-excel', hr, admin, checkRolesForAPI, exportDataToExcel)


module.exports = router;