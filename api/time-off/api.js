const { 
    getEmpInfo, 
    getTimeOffs, 
    addTimeOff, 
    getDirectors, 
    checkUploadPath, 
    uploadFilePathToDB,
    getTimeOffApproveForHR, 
    cancelRequestByHr, 
    approveRequestByHr, 
    getTimeOffApproveForDR, 
    cancelRequestByDR, 
    approveRequestByDR, 
    getTimeOffByID, 
    uploadLetterFilePathToDB, 
    checkLetterUploadPath,
    getTimeOffsForDirector,
    exportDataToExcel
} = require("./controller");
const express = require("express");
const router = express.Router();
const upload = require("./upload-middleware");
const letterUpload = require("./upload-letter");
const { hr, deptDirector, checkRoles, checkRolesForAPI} = require("../../modules/auth/auth");


router.post("/emp-info", hr, checkRolesForAPI, getEmpInfo);
router.post("/", hr, checkRolesForAPI, checkRolesForAPI, getTimeOffs);
router.get("/get-time-off-data/:id", hr, checkRolesForAPI, getTimeOffByID);
router.get("/for-director", deptDirector, checkRolesForAPI, getTimeOffsForDirector);
router.post('/add', hr, checkRolesForAPI, addTimeOff);
router.post("/get-directors", hr, checkRolesForAPI, getDirectors);
router.post("/upload-form/:id", hr, checkRolesForAPI, checkUploadPath, upload.single('file'), uploadFilePathToDB, (req, res) => {
    res.send({
        success: true,
        message: "Time off successfully added"
    })
});
router.post("/upload-letter/:id", hr, checkRolesForAPI, checkLetterUploadPath, letterUpload.single('file'), uploadLetterFilePathToDB, (req, res) => {
    res.send({
        success: true,
        message: "Time off successfully added"
    })
});

router.get("/approve-requests/hr/:id", hr, checkRolesForAPI, getTimeOffApproveForHR);
router.get("/cancel-requests/hr/:id", hr, checkRolesForAPI, cancelRequestByHr);
router.get("/approve-request/hr/:id", hr, checkRolesForAPI, approveRequestByHr);

router.get("/approve-requests/director/:id", deptDirector, checkRolesForAPI, getTimeOffApproveForDR);
router.get("/cancel-requests/director/:id", deptDirector, checkRolesForAPI, cancelRequestByDR);
router.get("/approve-request/director/:id", deptDirector, checkRolesForAPI, approveRequestByDR);
router.post('/export-to-excel', hr, deptDirector, checkRolesForAPI, exportDataToExcel);

module.exports = router;