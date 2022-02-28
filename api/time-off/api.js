const { getEmpInfo, getTimeOffs, addTimeOff, getDirectors, checkUploadPath, uploadFilePathToDB,
    getTimeOffApproveForHR, cancelRequestByHr, approveRequestByHr, getTimeOffApproveForDR, cancelRequestByDR, approveRequestByDR} = require("./controller");
const express = require("express");
const router = express.Router();
const upload = require("./upload-middleware");
const { hr, deptDirector} = require("../../modules/auth/auth");


router.post("/emp-info", hr, getEmpInfo);
router.get("/", hr, getTimeOffs);
router.get("/for-director", deptDirector, getTimeOffs);
router.post('/add', hr, addTimeOff);
router.post("/get-directors", hr, getDirectors);
router.post("/upload-form/:id", hr, checkUploadPath, upload.single('file'), uploadFilePathToDB, (req, res) => {
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