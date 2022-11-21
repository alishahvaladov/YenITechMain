const express = require("express");
const router = express.Router();
const { addPosition, getAllPositions, getPositionByID, updatePositionName, updateDeptPosRels, exportDataToExcel, getGroupsForPositions, getPositionsByGroup } = require("./controller");
const { admin, hr, checkRolesForAPI } = require("../../modules/auth/auth");

router.get('/', admin, checkRolesForAPI, getGroupsForPositions);
router.post('/add-position', admin, checkRolesForAPI, addPosition);
router.get('/by-group/:id', admin, hr, checkRolesForAPI, getPositionsByGroup);
router.post('/allPositions/:offset', admin, hr, checkRolesForAPI, getAllPositions);
router.get('/position-by-id/:id', admin, checkRolesForAPI, getPositionByID);
router.get('/update/name/:id', admin, checkRolesForAPI, updatePositionName);
router.get('/update/department', admin, checkRolesForAPI, updateDeptPosRels);
router.post('/export-to-excel', hr, admin, checkRolesForAPI, exportDataToExcel);


module.exports = router;