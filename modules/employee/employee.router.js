const { addEmployee, deleteEmployee, getEmployees, getEmployee, updateEmployee, updateJEnd, renderAddEmployee, checkUploadPath, uploadFilePathToDB} = require("./employee.controller");
const upload = require("./uplod-file-middleware");
const express = require("express");
const router = express.Router();
const { hr, super_admin } = require("../auth/auth");

const fileUploads = upload.fields([{ name: "application-form"}, {name: "injunction"}, {name: "work-book"}]);

router.get("/add-employee", hr, renderAddEmployee);


router.get('/employees')
router.get('/delete/:id', super_admin, deleteEmployee);
router.get("/", hr, getEmployees);
router.get("/update/:id", hr, getEmployee);
router.post("/remove/:id", checkUploadPath, fileUploads, uploadFilePathToDB,  updateJEnd);
router.post("/add-employee", hr, addEmployee);
router.post("/update/:id", hr, updateEmployee);
module.exports = router;