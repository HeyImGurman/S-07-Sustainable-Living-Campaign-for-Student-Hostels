const express = require("express");
const { getActivityLogs } = require("../controllers/logController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/", getActivityLogs);

module.exports = router;
