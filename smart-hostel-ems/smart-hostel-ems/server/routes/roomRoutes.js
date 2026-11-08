const express = require("express");
const {
  getRooms,
  getRoom,
  toggleAppliance,
  setAutomation,
  getSummary,
  getRoomOccupancyLogs,
} = require("../controllers/roomController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/summary", getSummary);
router.get("/", getRooms);
router.get("/:roomNumber", getRoom);
router.get("/:roomNumber/logs", getRoomOccupancyLogs);
router.patch("/:roomNumber/appliance", toggleAppliance);
router.patch("/:roomNumber/automation", authorize("admin", "student"), setAutomation);

module.exports = router;
