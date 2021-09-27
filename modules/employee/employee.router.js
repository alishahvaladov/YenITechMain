const { addEmployee, deleteEmployee, getEmployees, getEmployee, updateEmployee, updateJEnd, renderAddEmployee} = require("./employee.controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth");

router.get("/add-employee", hr, renderAddEmployee);


router.get('/employees')
router.get('/delete/:id', hr, deleteEmployee);
router.get("/", hr, getEmployees);
router.get("/update/:id", hr, getEmployee);
router.post("/remove",hr, updateJEnd);

router.post("/add-employee", hr, addEmployee);
router.post("/update/:id", hr, updateEmployee);



module.exports = router;