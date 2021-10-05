const { getFPrints, addFPrintToDB } = require("./controller");
const upload = require("./upload-middleware");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth");

router.get("/", hr, getFPrints);
router.post("/", upload.single("file"), addFPrintToDB);

module.exports = router;