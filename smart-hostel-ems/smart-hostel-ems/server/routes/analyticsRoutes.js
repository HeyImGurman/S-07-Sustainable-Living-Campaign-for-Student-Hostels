const express = require("express");
const {
  getDailyUsage,
  getHourlyUsage,
  getTopConsumingRooms,
  getOccupancyStats,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/daily", getDailyUsage);
router.get("/hourly", getHourlyUsage);
router.get("/top-rooms", getTopConsumingRooms);
router.get("/occupancy", getOccupancyStats);

module.exports = router;
