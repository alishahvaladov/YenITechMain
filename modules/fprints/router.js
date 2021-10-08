const { getFPrints, addFPrintToDB } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth");
const upload = require("./upload-middleware");

router.get("/", hr, getFPrints);
router.post("/", upload.single("file"), addFPrintToDB);

module.exports = router;