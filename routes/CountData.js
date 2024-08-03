const express = require("express");
const router = express.Router();

const { getCounts } = require("../controller/CountContloller");
// allQuestion user
router.get("", getCounts);

module.exports = router;
