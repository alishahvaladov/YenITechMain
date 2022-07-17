const { getFPrints, addFPrintToDB, checkIfFPrintForgotten, renderForgottenFPrints} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, deptDirector, checkRoles } = require("../auth/auth");
const upload = require("./upload-middleware");

router.get("/", hr, getFPrints);
router.post("/", upload.single("file"), addFPrintToDB, checkIfFPrintForgotten);
router.get("/test", checkIfFPrintForgotten);
router.get("/inappropriate-fprints", hr, renderForgottenFPrints);
router.get("/department", deptDirector, checkRoles, (req, res) => {
    if (req.user.role === 1) {
        return res.render("fprint/department-fprints", {
            super_admin: true
        });
    } else if (req.user.role === 5) {
        return res.render("fprint/department-fprints", {
            hr: true
        });
    } else if (req.user.role === 9) {
        return res.render("fprint/department-fprints", {
            hr: true
        });
    }
});

module.exports = router;