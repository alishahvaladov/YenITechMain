const { getDepartment, getPosition, getEmployee, empRenderPage, empRenderByPage } = require("./api-controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../../modules/auth/auth");


router.post("/department", hr, getDepartment);
router.post("/position", hr, getPosition);
router.post("/employee-data", hr, getEmployee);
router.post("/all-employee", hr, empRenderPage);
router.post("/emp-by-page", hr, empRenderByPage);

module.exports = router;