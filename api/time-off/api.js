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
    getTimeOffsForDirector
} = require("./controller");
const express = require("express");
const router = express.Router();
const upload = require("./upload-middleware");
const letterUpload = require("./upload-letter");
const { hr, deptDirector, checkRoles} = require("../../modules/auth/auth");


router.post("/emp-info", hr, getEmpInfo);
router.get("/", hr, getTimeOffs);
router.get("/get-time-off-data/:id", hr, getTimeOffByID);
router.get("/for-director", deptDirector, checkRoles, getTimeOffsForDirector);
router.post('/add', hr, addTimeOff);
router.post("/get-directors", hr, getDirectors);
router.post("/upload-form/:id", hr, checkUploadPath, upload.single('file'), uploadFilePathToDB, (req, res) => {
    res.send({
        success: true,
        message: "Time off successfully added"
    })
});
router.post("/upload-letter/:id", hr, checkLetterUploadPath, letterUpload.single('file'), uploadLetterFilePathToDB, (req, res) => {
    res.send({
        success: true,
        message: "Time off successfully added"
    })
});

router.get("/approve-requests/hr/:id", hr, getTimeOffApproveForHR);
router.get("/cancel-requests/hr/:id", hr, cancelRequestByHr);
router.get("/approve-request/hr/:id", hr, approveRequestByHr);

router.get("/approve-requests/director/:id", deptDirector, getTimeOffApproveForDR);
router.get("/cancel-requests/director/:id", deptDirector, cancelRequestByDR);
router.get("/approve-request/director/:id", deptDirector, approveRequestByDR);

module.exports = router;