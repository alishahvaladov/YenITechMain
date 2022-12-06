const express = require("express");
const router = express.Router();
const { addPosition, getAllPositions, getPositionByID, updatePositionName, updateDeptPosRels, exportDataToExcel, getGroupsForPositions, getPositionsByGroup } = require("./controller");
const { ensureAuthenticated, checkGroupAndRoles } = require("../../modules/auth/auth");

router.get('/', ensureAuthenticated, checkGroupAndRoles("Position_read"), getGroupsForPositions);
router.post('/add-position', ensureAuthenticated, checkGroupAndRoles("Position_create"), addPosition);
router.get('/by-group/:id', ensureAuthenticated, checkGroupAndRoles("Position_read"), getPositionsByGroup);
router.post('/allPositions/:offset', ensureAuthenticated, checkGroupAndRoles("Position_read"), getAllPositions);
router.get('/position-by-id/:id', ensureAuthenticated, checkGroupAndRoles("Position_read"), getPositionByID);
router.get('/update/name/:id', ensureAuthenticated, checkGroupAndRoles("Position_update"), updatePositionName);
router.get('/update/department', ensureAuthenticated, checkGroupAndRoles("Position_update"), updateDeptPosRels);
router.post('/export-to-excel', ensureAuthenticated, checkGroupAndRoles("Position_read"), exportDataToExcel);

module.exports = router;