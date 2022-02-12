const { getFPrints, addFPrintToDB, checkIfFPrintForgotten, renderForgottenFPrints} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth");
const upload = require("./upload-middleware");

router.get("/", hr, getFPrints);
router.post("/", upload.single("file"), addFPrintToDB, checkIfFPrintForgotten);
router.get("/test", checkIfFPrintForgotten);
router.get("/inappropriate-fprints", hr, renderForgottenFPrints);

module.exports = router;