const OccupancyLog = require("../models/OccupancyLog");

exports.getActivityLogs = async (req, res) => {
  try {
    const { roomNumber, event, limit } = req.query;
    const filter = {};
    if (roomNumber) filter.roomNumber = roomNumber;
    if (event) filter.event = event;

    const logs = await OccupancyLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 100);

    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Failed to load activity logs", error: err.message });
  }
};
