const { addEmployee, deleteEmployee, getEmployees, getEmployee, updateEmployee} = require("./employee.controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth");

router.get("/add-employee", hr, (req, res) => {
    if(req.user.role === 5) {
        return res.render("employee/add-employee", {
            hr: true
        });
    } else if (req.user.role === 1) {
        return res.render("employee/add-employee", {
            super_admin: true
        });
    }
});

router.get('/employees')
router.get('/delete/:id', hr, deleteEmployee);
router.get("/", hr, getEmployees);
router.get("/update/:id", hr, getEmployee);


router.post("/add-employee", hr, addEmployee);
router.post("/update/:id", hr, updateEmployee);



module.exports = router;