const { getEmpInfo, getTimeOffs, addTimeOff, getDirectors, checkUploadPath, uploadFilePathToDB} = require("./controller");
const express = require("express");
const router = express.Router();
const upload = require("./upload-middleware");
const { hr, ensureAuthenticated} = require("../../modules/auth/auth");


router.post("/emp-info", hr, getEmpInfo);
router.get("/", hr, getTimeOffs);
router.post('/add', hr, addTimeOff);
router.get("/approve-requests/hr/:id", hr, getTimeOffApproveForHR);
router.post("/get-directors", hr, getDirectors);
router.post("/upload-form/:id", hr, checkUploadPath, upload.single('file'), uploadFilePathToDB, (req, res) => {
    res.send({
        success: true,
        message: "Time off successfully added"
    })
});


module.exports = router;