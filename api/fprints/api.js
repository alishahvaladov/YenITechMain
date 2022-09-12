const { searchFPrint, renderFPrints, getFPrintsByPage, renderForgottenFPrints, updateForgottenFPrints, exportDataToExcel, getFPrintsForDeptDirectors, getActiveFPrints} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, deptDirector, checkRoles, checkRolesForAPI } = require("../../modules/auth/auth");

router.post("/search", hr, checkRolesForAPI, searchFPrint);
router.post("/all", hr, checkRolesForAPI, renderFPrints);
router.post("/by-page", hr, checkRolesForAPI, getFPrintsByPage);
router.get("/inappropriate-fprints/:offset", hr, checkRolesForAPI, renderForgottenFPrints);
router.get("/update/forgotten-fprints", updateForgottenFPrints);
router.post("/export-excel", hr, checkRolesForAPI, exportDataToExcel);
router.post("/department", deptDirector, checkRolesForAPI, getFPrintsForDeptDirectors);
router.post("/fprints", hr, checkRolesForAPI, getActiveFPrints);

module.exports = router;