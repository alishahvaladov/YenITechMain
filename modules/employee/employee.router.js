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
    renderDeletedEmployees,
    renderSingleEmployeePage
} = require("./employee.controller");
const upload = require("./uplod-file-middleware");
const addEmpUpload = require("./emp-upload-middleware");
const express = require("express");
const router = express.Router();
const { checkGroupAndRoles, ensureAuthenticated } = require("../auth/auth");



router.get("/add-employee", ensureAuthenticated, checkGroupAndRoles("Employee_add", true), renderAddEmployee);


router.get('/delete/:id', ensureAuthenticated, checkGroupAndRoles("Employee_delete", true), deleteEmployee);
router.get("/", ensureAuthenticated, checkGroupAndRoles("Employee_read", true), getEmployees);
router.post("/add-employee", ensureAuthenticated, checkGroupAndRoles("Employee_add", true), addEmployee);
router.get("/emp-files/:id", ensureAuthenticated, checkGroupAndRoles("Employee_add", true), renderEmpDirAddPage);
router.post("/remove/:id", ensureAuthenticated, checkGroupAndRoles("Employee_delete", true), checkUploadPath, upload.fields([
    {name: "application-form"},
    {name: "injunction"},
    {name: "work-book"}
]), uploadFilePathToDB,  updateJEnd);
router.post("/emp-files/:id", ensureAuthenticated, checkGroupAndRoles("Employee_add", true), checkUploadPath, addEmpUpload.fields([
    {name: "frScan"},
    {name: "pcScan"},
    {name: "hcScan"},
    {name: "injScan"},
    {name: "diplomaScan"},
    {name: "idScan"},
    {name: "lcScan"},
    {name: "profilePicture"}
]), uploadFilePathToDB);
router.get("/deleted-employees", ensureAuthenticated, checkGroupAndRoles("Employee_read", true), renderDeletedEmployees);
router.get("/single/:id", ensureAuthenticated, checkGroupAndRoles("Employee_read", true), renderSingleEmployeePage);
// router.get("/edited-employee/:id", ensureAuthenticated, checkGroupAndRoles("Employee_"))

module.exports = router;