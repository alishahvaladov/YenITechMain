const { searchFPrint, renderFPrints, getFPrintsByPage, renderForgottenFPrints, updateForgottenFPrints, exportDataToExcel, getFPrintsForDeptDirectors} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, deptDirector, checkRoles } = require("../../modules/auth/auth");

router.post("/search", hr, searchFPrint);
router.post("/all", hr, renderFPrints);
router.post("/by-page", hr, getFPrintsByPage);
router.get("/inappropriate-fprints/:offset", hr, renderForgottenFPrints);
router.get("/update/forgotten-fprints", updateForgottenFPrints);
router.post("/export-excel", hr, checkRoles, exportDataToExcel);
router.post("/department", deptDirector, checkRoles, getFPrintsForDeptDirectors);

module.exports = router;