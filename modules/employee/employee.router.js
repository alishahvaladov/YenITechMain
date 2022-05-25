const {
    addEmployee,
    deleteEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    updateJEnd,
    renderAddEmployee,
    checkUploadPath,
    uploadFilePathToDB,
    renderEmpDirAddPage,
    exportEmployeesToExcel,
    renderDeletedEmployees
} = require("./employee.controller");
const upload = require("./uplod-file-middleware");
const addEmpUpload = require("./emp-upload-middleware");
const express = require("express");
const router = express.Router();
const { hr, super_admin, checkRoles, audit } = require("../auth/auth");



router.get("/add-employee", hr, renderAddEmployee);


router.get('/delete/:id', super_admin, checkRoles, deleteEmployee);
router.get("/", hr, getEmployees);
// router.get("/update/:id", hr, getEmployee);
router.post("/add-employee", hr, checkRoles, addEmployee);
// router.post("/update/:id", hr, updateEmployee);
router.get("/emp-files/:id", hr, renderEmpDirAddPage);
router.post("/remove/:id", hr, checkUploadPath, upload.fields([
    {name: "application-form"},
    {name: "injunction"},
    {name: "work-book"}
]), uploadFilePathToDB,  updateJEnd);
router.post("/emp-files/:id", hr, checkUploadPath, addEmpUpload.fields([
    {name: "frScan"},
    {name: "pcScan"},
    {name: "hcScan"},
    {name: "injScan"},
    {name: "diplomaScan"},
    {name: "idScan"},
    {name: "lcScan"},
    {name: "profilePicture"}
]), uploadFilePathToDB);
router.get("/deleted-employees", hr, audit, checkRoles, renderDeletedEmployees);

module.exports = router;