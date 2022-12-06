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
const { ensureAuthenticated, checkGroupAndRoles } = require("../../modules/auth/auth");


router.post("/emp-info", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_read"), getEmpInfo);
router.post("/", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_read"), getTimeOffs);
router.get("/get-time-off-data/:id", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_read"), getTimeOffByID);
router.get("/for-director", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_read"), getTimeOffsForDirector);
router.post('/add', ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_create"), addTimeOff);
router.post("/get-directors", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_read"), getDirectors);
router.post("/upload-form/:id", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_create"), checkUploadPath, upload.single('file'), uploadFilePathToDB, (req, res) => {
    res.send({
        success: true,
        message: "Time off successfully added"
    })
});
router.post("/upload-letter/:id", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_create"), checkLetterUploadPath, letterUpload.single('file'), uploadLetterFilePathToDB, (req, res) => {
    res.send({
        success: true,
        message: "Time off successfully added"
    })
});

router.get("/approve-requests/hr/:id", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_update"), getTimeOffApproveForHR);
router.get("/cancel-requests/hr/:id", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_update"), cancelRequestByHr);
router.get("/approve-request/hr/:id", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_update"), approveRequestByHr);

router.get("/approve-requests/director/:id", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_update"), getTimeOffApproveForDR);
router.get("/cancel-requests/director/:id", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_update"), cancelRequestByDR);
router.get("/approve-request/director/:id", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_update"), approveRequestByDR);
router.post('/export-to-excel', ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_read"), exportDataToExcel);

module.exports = router;